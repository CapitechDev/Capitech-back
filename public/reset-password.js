document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reset-form");
    const passwordInput = document.getElementById("password");
    const messageElement = document.getElementById("message");
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
        messageElement.textContent = "Token de recuperação inválido.";
        messageElement.style.color = "red";
        form.style.display = "none";
        return;
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        try {
            const res = await fetch("http://localhost:4000/users-mobile/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (data.sucess) {
                messageElement.textContent =
                    data.message || "Senha redefinida com sucesso!";
                messageElement.style.color = "green";
                form.reset();
            }
            else {
                messageElement.textContent = data.message
                    ? `Erro ao redefinir senha: ${data.message}`
                    : "Erro ao redefinir senha. Tente novamente.";
                messageElement.style.color = "red";
            }
        }
        catch (error) {
            console.error("Erro:", error);
            messageElement.textContent = "Erro de conexão.";
            messageElement.style.color = "red";
        }
    });
});
