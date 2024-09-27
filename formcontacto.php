<?php

header('Content-Type: text/html; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/Exception.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/PHPMailer.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $mail = new PHPMailer(true);

    try {
         // Configuraciones del servidor SMTP
         $mail->SMTPDebug = SMTP::DEBUG_SERVER;           // Habilitar la salida de depuración detallada
         $mail->isSMTP(); // Enviar utilizando SMTP
         $mail->Host = 'mail.edgecloud.com.mx'; // Servidor SMTP de Gmail
         $mail->SMTPAuth = true; // Habilitar la autenticación SMTP
 
         // CAMBIAR CREDENCIALES DEL CORREO
         $mail->Username = 'contacto@edgecloud.com.mx'; // Tu dirección de correo electrónico
         $mail->Password = 'Operaciones1'; // Tu contraseña de correo electrónico (considérala mover a un archivo de configuración o variable de entorno)
         $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Habilitar la encriptación SSL/TLS
         $mail->Port = 465;                      // Puerto TCP para conectarse

        // Destinatario del correo
        $mail->setFrom('contacto@edgecloud.com.mx', 'EDGE & CLOUD');
        $mail->addAddress('contacto@edgecloud.com.mx'); // Dirección de correo del destinatario

        // Asunto y cuerpo del correo
        $mail->isHTML(true);                             // Establecer el formato de correo HTML
        $mail->Subject = 'EDGE & CLOUD - CONTACTO';       // Asunto del correo

        // Construir el cuerpo del correo electrónico usando los datos del formulario
        $body = '<p>Nombre: ' . $_POST['nombre'] . '</p>';
        $body .= '<p>Correo: ' . $_POST['correo'] . '</p>';
        $body .= '<p>Asunto: ' . $_POST['asunto'] . '</p>';
        $body .= '<p>Mensaje: ' . $_POST['mensaje'] . '</p>';

        $mail->Body = $body;  // Cuerpo del correo electrónico

        // Enviar el correo electrónico
        $mail->send();
        echo '¡Mensaje enviado!';
        // Redirigir al usuario al archivo index.php
        header('Location: ./contacto/');
        exit; // Asegura que el script se detenga después de la redirección
    } catch (Exception $e) {
        echo "El mensaje no pudo ser enviado. Error: {$mail->ErrorInfo}";
    }
}
?>