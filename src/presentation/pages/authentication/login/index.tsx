import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ENDPOINTS } from "../../../../utils/constants";
import { STORAGE } from "../../../../utils/constants/storage";
import "./styles.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa o erro antes de tentar o login

    try {
      // Realiza a requisição para o endpoint de login
      const response = await axios.post(ENDPOINTS.LOGIN, { email, password });

      // Captura o token da resposta e armazena no localStorage
      const token = response.data.token;
      localStorage.setItem(STORAGE.AUTH_KEY, token);

      // Redirecionar ou mostrar sucesso (ajuste conforme a lógica de sua aplicação)
      console.log("Login realizado com sucesso!");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas, tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <h1>PER ONBOARDING</h1>
      </div>

      <div className="right-side">
        <div className="container-login">
          <div className="wrap-login">
            <form className="login-form" onSubmit={handleLogin}>
              <span className="login-form-title"> BEM-VINDO </span>

              <div className="wrap-input">
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="focus-input" data-placeholder="Email"></span>
              </div>

              <div className="wrap-input">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="focus-input" data-placeholder="Senha"></span>

                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </span>
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="container-login-form-btn">
                <button type="submit" className="login-form-btn">
                  Acessar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
