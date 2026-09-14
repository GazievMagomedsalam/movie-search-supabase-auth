export default function AuthForm({
  email,
  password,
  setEmail,
  setPassword,
  signUp,
  signIn,
  authMessage,
}) {
  return (
    <div className="auth">
      <h1>Авторизация</h1>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button onClick={signUp}>Зарегистрироваться</button>

      <button onClick={signIn}>Войти</button>

      {authMessage && <p>{authMessage}</p>}
    </div>
  );
}
