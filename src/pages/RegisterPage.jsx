import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { register } from '../services/userService';

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0d0d0d", paper: "#121212" },
    primary: { main: "#1E88E5" },
    text: { primary: "#E0E0E0", secondary: "#90CAF9" },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "Roboto, sans-serif" },
});


export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Vui lòng nhập tên";
    if(name.length >50) {
      newErrors.name = "Tên không được vượt quá 50 ký tự";
    }
    if(!/^[a-zA-Z\s]+$/.test(name)){
      newErrors.name = "Tên không được chứa ký tự đặc biệt";
    }
    if (!email.trim()) {
        newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Email không đúng định dạng";
    }
    if (!phone.trim()) {
        newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,15}$/.test(phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (password !== confirm) {
        newErrors.confirm = "Mật khẩu không khớp";
    }
    return newErrors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) 
        {
            return;
        }
        setLoading(true);
        try{
            const payload ={name, email, phone, password, password_confirmation:confirm};
            console.log("Register payload:", payload);
            const res= await register(payload);
            const token = res?.data?.access_token ?? res?.access_token ?? null;
            const user = res?.data?.user ?? res?.user ?? res?.data ?? null;
            if(token) localStorage.setItem("access_token", token);
            try {localStorage.setItem("user", JSON.stringify(user || {}));} catch(_){}
            navigate("/trang-chu");
        }catch(err){
            const respData = err?.response?.data;
            console.error("Registration error:", err);
            const status = err?.response?.status;
            console.error("Validation error(422) response data:", respData);
            if(status === 422){
                const messages = err?.response?.data?.errors;
                console.error("Validation error(422) response messages:", respData);
                console.log("data", err?.response?.data);
                if(messages){
                    const first = Object.values(messages).flat()[0];
                    setError(first || "Dữ liệu không hợp lệ");
                }else setError("Dữ liệu không hợp lệ");
            }else if(status === 400){
                setError("Email đã tồn tại");
            }else{
                setError("Đăng ký thất bại, vui lòng thử lại");
            }
        }finally{
            setLoading(false);
        }
    };
    function sanitizePhone(value){
        if(!value) return "";
        return String(value).replace(/\D/g, "").slice(0, 10);
    }
    return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d0d0d 40%, #1E3A5F 100%)", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ p: 4, backgroundColor: "#121212", border: "1px solid #1E88E5", boxShadow: "0px 0px 20px rgba(30,136,229,0.2)" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ m: 1, bgcolor: "#1E88E5" }}>
                <PersonAddIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Tạo tài khoản
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
                <Stack spacing={1}>
                  <TextField margin="normal" required fullWidth id="name" label="Họ và tên" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name} InputLabelProps={{ style: { color: "#90CAF9" } }} InputProps={{ style: { color: "white" } }} />

                  <TextField margin="normal" required fullWidth id="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} InputLabelProps={{ style: { color: "#90CAF9" } }} InputProps={{ style: { color: "white" } }} />

                  <TextField margin="normal" fullWidth id="phone" label="Số điện thoại * " variant="outlined" value={phone} onChange={(e) => setPhone(sanitizePhone(e.target.value))} error={!!errors.phone} helperText={errors.phone} inputProps={{ inputMode: "numeric", maxLength: 10 }} InputLabelProps={{ style: { color: "#90CAF9" } }} InputProps={{ style: { color: "white" } }} />
                  <TextField margin="normal" required fullWidth name="password" label="Mật khẩu" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} InputLabelProps={{ style: { color: "#90CAF9" } }} InputProps={{ style: { color: "white" } }} />

                  <TextField margin="normal" required fullWidth name="confirm" label="Xác nhận mật khẩu" type="password" variant="outlined" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={!!errors.confirm} helperText={errors.confirm} InputLabelProps={{ style: { color: "#90CAF9" } }} InputProps={{ style: { color: "white" } }} />

                  {error && <Typography variant="body2" sx={{ color: "#ef5350", mt: 1, textAlign: "center" }}>{error}</Typography>}

                  {/* <FormControlLabel control={<Checkbox value="agree" color="primary" />} label={<Typography variant="body2" sx={{ color: "#90CAF9" }}>Tôi đồng ý với <Link href="#" sx={{ color: "#64B5F6" }}>Điều khoản & Điều kiện</Link></Typography>} /> */}

                  <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 1, py: 1.2, fontWeight: "bold", backgroundColor: "#1E88E5", "&:hover": { backgroundColor: "#1565C0" } }}>
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Tạo tài khoản"}
                  </Button>

                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Link href="/login" variant="body2" sx={{ color: "#64B5F6" }}>Đã có tài khoản</Link>
                    {/* <Link href="/" variant="body2" sx={{ color: "#64B5F6" }}>Quay về trang chủ</Link> */}
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}