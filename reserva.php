<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = htmlspecialchars($_POST["nome"]);
    $email = htmlspecialchars($_POST["email"]);
    $telefone = htmlspecialchars($_POST["telefone"]);
    $quarto = htmlspecialchars($_POST["quarto"]);
    $checkin = htmlspecialchars($_POST["checkin"]);
    $checkout = htmlspecialchars($_POST["checkout"]);
    ?>

    <div class="container my-5">
      <div class="card shadow-lg border-0 rounded-4 mx-auto" style="max-width: 650px;">
        <div class="card-body text-center p-5">
          <h2 class="fw-bold text-success mb-4">✅ Reserva Confirmada!</h2>
          <p class="lead">Sua reserva foi registrada com sucesso. Confira os detalhes abaixo:</p>
          
          <hr class="my-4">

          <div class="text-start">
            <p><strong>👤 Nome:</strong> <?php echo $nome; ?></p>
            <p><strong>📧 E-mail:</strong> <?php echo $email; ?></p>
            <p><strong>📞 Telefone:</strong> <?php echo $telefone; ?></p>
            <p><strong>🛏️ Suíte escolhida:</strong> <?php echo $quarto; ?></p>
            <p><strong>📅 Check-in:</strong> <?php echo $checkin; ?></p>
            <p><strong>📅 Check-out:</strong> <?php echo $checkout; ?></p>
          </div>

          <hr class="my-4">

          <p class="mt-3">✨ Obrigado por reservar com a <strong>Pousada Casa da Lua</strong>!  
          Estamos ansiosos para recebê-lo.</p>

          <a href="index.html" class="btn btn-danger mt-3 px-4 rounded-pill">
            Voltar para o site
          </a>
        </div>
      </div>
    </div>

<?php
}
?>