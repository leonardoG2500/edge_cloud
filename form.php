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
        $mail->SMTPDebug = SMTP::DEBUG_OFF; // Deshabilitar salida de depuración en producción
        $mail->isSMTP();
        $mail->Host = 'mail.edgecloud.com.mx';
        $mail->SMTPAuth = true;
        
        // Mover credenciales de correo a un archivo seguro o variable de entorno
        $mail->Username = 'contacto@edgecloud.com.mx'; 
        $mail->Password = 'Operaciones1';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Destinatario del correo
        $mail->setFrom('contacto@edgecloud.com.mx', 'EDGE & CLOUD');
        $mail->addAddress('contacto@edgecloud.com.mx');

        // Asunto y cuerpo del correo
        $mail->isHTML(true);
        $mail->Subject = 'EDGE & CLOUD - SOLICITUD DE COTIZACION';

        // Cuerpo del correo usando los datos del formulario
        $body = '<p>Nombre: ' . $_POST['nombre'] . '</p>';
        $body .= '<p>Correo: ' . $_POST['correo'] . '</p>';
        $body .= '<p>Telefono: ' . $_POST['telefono'] . '</p>';
        $body .= '<p>Mensaje: ' . $_POST['mensaje'] . '</p>';

        $mail->Body = $body;

        // Enviar el correo
        $mail->send();
        
        // Redirigir después del envío exitoso
        header('Location: ./');
        exit;

    } catch (Exception $e) {
        echo "El mensaje no pudo ser enviado. Error: {$mail->ErrorInfo}";
    }
}
?>
