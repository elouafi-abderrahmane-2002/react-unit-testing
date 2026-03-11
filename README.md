# 🧪 React Unit Testing — Jest & React Testing Library

On peut développer une app React qui "marche" — et se retrouver avec des bugs en production
parce que personne n'a vérifié ce qui se passe quand l'utilisateur clique au mauvais endroit,
soumet un formulaire vide, ou reçoit une erreur API.

Ce projet est ma suite de tests unitaires et d'intégration pour des composants React,
construite avec Jest et React Testing Library (RTL). L'idée centrale de RTL m'a convaincu
dès le début : tester ce que *l'utilisateur voit et fait*, pas les détails d'implémentation.

---

## Philosophie de test adoptée

```
  ❌ Mauvaise approche (test d'implémentation)
  ─────────────────────────────────────────────
  test('state is updated', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)   // ← teste le state interne
  })

  ✅ Bonne approche (test comportemental - RTL)
  ─────────────────────────────────────────────
  test('user can increment counter', () => {
    render(<Counter />)
    fireEvent.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('1')).toBeInTheDocument()  // ← teste ce que voit l'user
  })
```

Si on refactorise le composant internement, le 2ème test continue à passer.
Le 1er casse. C'est ça la différence.

---

## Ce que couvre la suite de tests

```
src/
│
├── components/
│   ├── __tests__/
│   │   ├── Button.test.jsx        ← rendu, click, disabled state
│   │   ├── Form.test.jsx          ← soumission, validation, erreurs
│   │   ├── LoginForm.test.jsx     ← auth flow, appel API mocké
│   │   ├── UserList.test.jsx      ← chargement async, liste vide, erreur
│   │   └── HiddenMessage.test.jsx ← toggle, accessibilité (role/label)
│   └── *.jsx
│
├── hooks/
│   └── __tests__/
│       └── useAuth.test.js        ← hook custom, renderHook
│
├── services/
│   └── __tests__/
│       └── api.test.js            ← fetch mocké, gestion d'erreurs
│
└── mocks/
    └── handlers.js                ← MSW : mock des endpoints API
```

---

## Exemple : test d'authentification avec MSW

```jsx
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../Login'

// Mock du serveur API — aucun vrai appel réseau
const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake_user_token' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  localStorage.removeItem('token')
})
afterAll(() => server.close())

test('user can log in successfully', async () => {
  render(<Login />)

  // L'utilisateur remplit le formulaire
  fireEvent.change(screen.getByLabelText(/email/i),
    { target: { value: 'user@test.com' } })
  fireEvent.change(screen.getByLabelText(/password/i),
    { target: { value: 'password123' } })
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  // On attend le retour async de l'API mockée
  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent(/connecté/i)
})

test('shows error on wrong credentials', async () => {
  // Override du handler pour simuler une erreur 401
  server.use(
    rest.post('/api/login', (req, res, ctx) =>
      res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
    )
  )
  render(<Login />)
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  expect(await screen.findByText(/identifiants incorrects/i)).toBeInTheDocument()
})
```

---

## Lancer les tests

```bash
git clone https://github.com/elouafi-abderrahmane-2002/react-unit-testing.git
cd react-unit-testing && npm install

npm test                    # mode watch
npm test -- --coverage      # rapport de couverture
npm test -- --watchAll=false # run once (CI mode)
```

---

## Ce que j'ai appris

La chose la plus utile : la différence entre `getBy`, `queryBy` et `findBy`.
`getBy` lance une erreur si l'élément n'existe pas — parfait pour les assertions.
`queryBy` retourne `null` — utile pour vérifier qu'un élément *n'est pas* là.
`findBy` retourne une promise — indispensable pour les éléments qui apparaissent
après une opération async (appel API, setTimeout).

Confondre les trois génère des tests qui passent pour de mauvaises raisons.

---

*Projet réalisé dans le cadre de ma formation ingénieur — ENSET Mohammedia*
*Par **Abderrahmane Elouafi** · [LinkedIn](https://www.linkedin.com/in/abderrahmane-elouafi-43226736b/) · [Portfolio](https://my-first-porfolio-six.vercel.app/)*
