import { Router } from "@router";
import { AuthProvider, AxiosProvider, ThemeProvider } from "@contexts";

function App() {
  return (
    <>
      <AuthProvider>
        <AxiosProvider>
            <ThemeProvider>
              <Router />
            </ThemeProvider>
        </AxiosProvider>
      </AuthProvider>
    </>
  )
}

export default App
