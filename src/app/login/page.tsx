// app/login/page.tsx
export default function LoginPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 border rounded"
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>
      </div>
    )
  }
  