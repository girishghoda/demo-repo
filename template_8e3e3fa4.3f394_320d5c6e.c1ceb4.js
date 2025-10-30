<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agent ChatBot</title>
    <style>
        .styled-link {
            color: #1a73e8;
            text-decoration: none;
            font-weight: bold;
        }
        .styled-link:hover {
            text-decoration: underline;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script defer="defer" src="/mic/AI-Agent-Chatbot/main.js"></script>
    <link href="/mic/AI-Agent-Chatbot/main.css" rel="stylesheet">
</head>
<body>

<script>
    // Extract flow_id from URL and store in local storage
    document.addEventListener("DOMContentLoaded", function() {
        // Extract flow_id from the path
        const pathParts = window.location.pathname.split('/');
        const flowId = pathParts[pathParts.length - 1];  // flow_id should be the last part of the path
    
        if (flowId) {
            localStorage.setItem("flow_id", flowId);
        }
    
        console.log("Stored Flow ID:", localStorage.getItem("flow_id")); // Debugging
    });

</script>

<div id="root"></div>

</body>
</html>
