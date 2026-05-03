import React, { useState } from "react";
import {
    Avatar,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Box,
    CircularProgress,
    Link,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: { default: "#0d0d0d", paper: "#121212" },
        primary: { main: "#1E88E5" },
        secondary: { main: "#64B5F6" },
        text: { primary: "#E0E0E0", secondary: "#90CAF9" },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: "Roboto, sans-serif" },
});
const API_BASE = process.env.REACT_APP_API_BASE || "https://api.blogcuavinh.id.vn";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMsg("");
        try {
                const res = await axios.post(`${API_BASE}/api/send-otp`, { email });

                if (res.data.status) {
                    setMsg(res.data.message);
                    setStep(2);
                } else {
                    setError(res.data.message);
                }

            } catch (err) {
                setError(err.response?.data?.message || "Lỗi server");
            }finally{
            setLoading(false);
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMsg("");
        try{
            await axios.post(`${API_BASE}/api/reset-password`, { email, otp, new_password: newPassword });
            setMsg("Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.");
            setTimeout(() => navigate("/login"), 3000);
        }catch(err){
            setError("Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin.");
        }finally{
            setLoading(false);
        }
    };
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight:"100vh",background: "linear-gradient(135deg, #0d0d0d 40%, #1E3A5F 100%)",display: "flex",justifyContent: "center",alignItems: "center",p: 2,  }}>
                <Container maxWidth="xs">
                    <Paper elevation={6} sx={{ p:4,backgroundColor:"#121212", border:"1px solid #1E88E5", boxShadow:"0px 0px 20px rgba(30,136,229,0.2)", }}>
                        <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                            <Avatar sx={{ m:1,bgcolor:"#1E88E5" }}><LockResetIcon /></Avatar>
                            <Typography component="h1" variant="h5">
                                Quên mật khẩu
                            </Typography>
                            {step === 1 && (
                                <Box component="form" onSubmit={handleSendOtp} sx={{ width:"100%" }}>
                                    <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} InputLabelProps={{ style: { color: "#90CAF9" }}}   InputProps={{ style: { color: "white" } }}/>
                                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                                    {msg && <Typography color="primary" variant="body2">{msg}</Typography>}
                                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt:3, mb:2, py:1.2, fontWeight:"bold", fontSize: "1rem", backgroundColor:"#1E88E5","&:hover":{backgroundColor:"#1565C0", boxShadow: "0px 0px 10px rgba(30,136,229,0.5",}, }}>
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi OTP"}
                                    </Button>
                                    <Box sx={{ textAlign:"center" }}>
                                        <Link href="/login" variant="body2" sx={{ color:"#90CAF9", "&:hover":{ color:"#64B5F6", textDecoration:"underline", }, }}>
                                            Quay lại đăng nhập
                                        </Link>
                                    </Box>
                                </Box>
                            )}
                            {step === 2 && (
                                <Box component="form" onSubmit={handleResetPassword} sx={{ width:"100%" }}>
                                    <TextField margin="normal" required fullWidth id="otp" label="OTP" name="otp" autoComplete="otp" autoFocus variant="outlined" value={otp} onChange={(e) => setOtp(e.target.value)} InputLabelProps={{ style: { color: "#90CAF9" }}}   InputProps={{ style: { color: "white" } }}/>
                                    <TextField margin="normal" required fullWidth name="newPassword" label="Mật khẩu mới" type="password" id="newPassword" autoComplete="new-password" variant="outlined" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} InputLabelProps={{ style: { color: "#90CAF9" }}}   InputProps={{ style: { color: "white" } }}/>
                                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                                    {msg && <Typography color="primary" variant="body2">{msg}</Typography>}
                                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt:3, mb:2, py:1.2, fontWeight:"bold", fontSize: "1rem", backgroundColor:"#1E88E5","&:hover":{backgroundColor:"#1565C0", boxShadow: "0px 0px 10px rgba(30,136,229,0.5",}, }}>
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    )
}
