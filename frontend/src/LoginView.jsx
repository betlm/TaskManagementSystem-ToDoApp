import React, { useState } from 'react';
import axios from 'axios';

const LoginView = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authUrl = "http://localhost:5093/api/Auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "register" : "login";
    
    try {
      const response = await axios.post(`${authUrl}/${endpoint}`, {
        username,
        password
      });

      if (isRegistering) {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
        setIsRegistering(false);
      } else {
        // Backend'den dönen user nesnesinin ID'sini üst bileşene (App.jsx) gönderiyoruz
        onLoginSuccess(response.data.id);
      }
    } catch (error) {
      const errorMsg = error.response?.data || "Bir hata oluştu!";
      alert(errorMsg);
    }
  };

  return (
    <div className="login-overlay" style={styles.overlay}>
      <div className="login-box" style={styles.box}>
        <h2 style={styles.title}>{isRegistering ? "Hesap Oluştur" : "Giriş Yap"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required 
            />
          </div>
          <button type="submit" style={styles.button}>
            {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>
        <p style={styles.footer}>
          {isRegistering ? "Zaten hesabın var mı?" : "Henüz hesabın yok mu?"}{" "}
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={styles.link}
          >
            {isRegistering ? "Giriş Yap" : "Hemen Kaydol"}
          </span>
        </p>
      </div>
    </div>
  );
};

// Basit inline stiller (Dashboard ile uyumlu olması için antrasit tonlarda)
const styles = {
  overlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#2c3e50' },
  box: { background: '#fdfeff', padding: '40px', borderRadius: '20px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  title: { color: '#2c3e50', textAlign: 'center', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', color: '#262525', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' },
  button: { padding: '14px', borderRadius: '10px', border: 'none', background: '#2c3e50', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' },
  link: { color: '#2c3e50', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }
};

export default LoginView;