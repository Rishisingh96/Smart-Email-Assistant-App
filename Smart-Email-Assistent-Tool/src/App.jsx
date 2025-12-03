import * as React from "react";

import {
  Container,
  Typography,
  Box,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

export default function App() {
  const [emailContent, setEmailContent] = React.useState("");
  const [tone, setTone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [generatedReply, setGeneratedReply] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState("success");

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRows = isSmall ? 5 : 7;
  const outputRows = isSmall ? 6 : 8;

  const handleSubmit = async () => {
    if (!emailContent.trim()) return;
    setLoading(true);
    setGeneratedReply("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
        }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Error generating reply:", error);
      setSnackMessage("Failed to generate reply");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply.trim()) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedReply);
      } else {
        // fallback for older browsers
        const el = document.createElement("textarea");
        el.value = generatedReply;
        // place off-screen
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        // execCommand may return false on some browsers; still attempt
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setSnackMessage("Copied to clipboard");
      setSnackSeverity("success");
      setSnackOpen(true);
    } catch (err) {
      console.error("Copy failed", err);
      setSnackMessage("Copy failed");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        Email Reply Generator
      </Typography>

      <Box sx={{ mt: 2 }}>
        <TextField
          label="Original Email Content"
          fullWidth
          multiline
          rows={inputRows}
          variant="outlined"
          placeholder="Paste the email you want to reply to here..."
          margin="normal"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-select-label"
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!emailContent.trim() || loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "GENERATE REPLY"
            )}
          </Button>
        </Box>

        <TextField
          sx={{ mt: 3 }}
          fullWidth
          multiline
          rows={outputRows}
          variant="outlined"
          placeholder="Generated reply will appear here"
          value={generatedReply}
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCopy}
            disabled={!generatedReply.trim()}
          >
            COPY TO CLIPBOARD
          </Button>
        </Box>

        <Snackbar
          open={snackOpen}
          autoHideDuration={2500}
          onClose={handleSnackClose}
        >
          <Alert
            onClose={handleSnackClose}
            severity={snackSeverity}
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
