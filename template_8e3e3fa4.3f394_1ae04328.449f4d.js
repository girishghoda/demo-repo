<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Research Assistant</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS Variables for Theme System */
        :root {
            /* Light Theme */
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --bg-tertiary: #e9ecef;
            --bg-hover: #dee2e6;
            --text-primary: #212529;
            --text-secondary: #495057;
            --text-tertiary: #6c757d;
            --accent-primary: #4a90e2;
            --accent-secondary: #357abd;
            --accent-hover: #2868a8;
            --border-color: #dee2e6;
            --shadow-sm: rgba(0, 0, 0, 0.05);
            --shadow-md: rgba(0, 0, 0, 0.1);
            --shadow-lg: rgba(0, 0, 0, 0.15);
            --success: #28a745;
            --warning: #ffc107;
            --error: #dc3545;
            --info: #17a2b8;
        }

        [data-theme="dark"] {
            /* Dark Theme - Galaxy Neutron (No Gradients) */
            --bg-primary: #0a0e27;
            --bg-secondary: #1a1f3a;
            --bg-tertiary: #2d3561;
            --bg-hover: #3d4785;
            --text-primary: #e8eaf0;
            --text-secondary: #b8bcc8;
            --text-tertiary: #8a8f9e;
            --accent-primary: #5b6fb5;
            --accent-secondary: #7c8fd9;
            --accent-hover: #9daae6;
            --border-color: #3d4785;
            --shadow-sm: rgba(0, 0, 0, 0.3);
            --shadow-md: rgba(0, 0, 0, 0.4);
            --shadow-lg: rgba(0, 0, 0, 0.5);
            --success: #4caf50;
            --warning: #ff9800;
            --error: #f44336;
            --info: #2196f3;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: background-color 0.3s, color 0.3s;
        }

        /* Header */
        .header {
            background-color: var(--bg-secondary);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px var(--shadow-sm);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background-color: var(--accent-primary);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.25rem;
        }

        .logo-text h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .logo-text p {
            font-size: 0.75rem;
            color: var(--text-tertiary);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .header-nav {
            background-color: var(--bg-tertiary);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            color: var(--text-primary);
            font-size: 0.9rem;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .header-nav:hover {
            background-color: var(--bg-hover);
        }

        .header-nav.active {
            background-color: var(--accent-primary);
            color: white;
        }

        .theme-toggle {
            background-color: var(--bg-tertiary);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            color: var(--text-primary);
            font-size: 0.9rem;
            transition: background-color 0.2s;
        }

        .theme-toggle:hover {
            background-color: var(--bg-hover);
        }

        /* Container */
        .container {
            display: flex;
            height: calc(100vh - 80px);
            overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background-color: var(--bg-secondary);
            padding: 1.5rem;
            overflow: hidden;
            box-shadow: 2px 0 8px var(--shadow-sm);
            display: flex;
            flex-direction: column;
        }

        .nav-section {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            margin-bottom: 1.5rem;
        }

        .nav-section:last-of-type {
            flex: 1;
        }

        .nav-section h3 {
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--text-tertiary);
            margin-bottom: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 0.5rem 0;
            user-select: none;
            flex-shrink: 0;
        }

        .nav-section h3:hover {
            color: var(--text-primary);
        }

        .history-category {
            margin-bottom: 1rem;
        }

        .history-category h4 {
            font-size: 0.7rem;
            text-transform: uppercase;
            color: var(--text-tertiary);
            margin: 0 0 0.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 0.25rem 0;
            user-select: none;
        }

        .history-category h4:hover {
            color: var(--text-primary);
        }

        .collapse-icon {
            font-size: 0.9rem;
            transition: transform 0.2s;
            display: inline-block;
        }

        .history-category-content {
            max-height: 1000px;
            overflow-y: auto;
            overflow-x: hidden;
            transition: max-height 0.3s ease-out;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding-right: 0.5rem;
        }

        .history-category-content.collapsed {
            max-height: 0;
            overflow: hidden;
        }

        .collapsible-content {
            max-height: 500px;
            overflow-y: auto;
            overflow-x: hidden;
            transition: max-height 0.3s ease-out;
            padding-right: 0.5rem;
        }

        .collapsible-content.collapsed {
            max-height: 0;
            overflow: hidden;
        }

        .history-item {
            padding: 0.5rem 0.75rem;
            background-color: var(--bg-tertiary);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .history-item:hover {
            background-color: var(--bg-hover);
        }

        .history-item.active {
            background-color: var(--accent-primary);
            color: white;
        }

        .history-title {
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .papers-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .nav-item {
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .nav-item:hover {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
        }

        .nav-item.active {
            background-color: var(--accent-primary);
            color: white;
        }

        .nav-icon {
            font-size: 1.1rem;
        }

        .new-chat-btn {
            width: 100%;
            padding: 0.75rem;
            background-color: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            margin-bottom: 1rem;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .new-chat-btn:hover {
            background-color: var(--accent-secondary);
        }

        /* Follow-up Toggle */
        .follow-up-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: var(--bg-hover);
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .toggle-switch.active {
            background-color: var(--accent-primary);
        }

        .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .toggle-switch.active .toggle-slider {
            transform: translateX(20px);
        }

        /* Main Content */
        .main-content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
            background-color: var(--bg-primary);
        }

        /* Card */
        .card {
            background-color: var(--bg-secondary);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px var(--shadow-sm);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Button */
        .btn {
            padding: 0.625rem 1.25rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background-color: var(--accent-primary);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--accent-secondary);
        }

        .btn-secondary {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background-color: var(--bg-hover);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Input */
        .input {
            width: 100%;
            padding: 0.875rem 1rem;
            border: none;
            border-radius: 10px;
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            font-size: 0.9rem;
            transition: all 0.2s;
        }

        .input:focus {
            outline: none;
            background-color: var(--bg-hover);
            box-shadow: 0 0 0 3px rgba(91, 111, 181, 0.15);
        }

        .input::placeholder {
            color: var(--text-tertiary);
        }

        textarea.input {
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
        }

        select.input {
            cursor: pointer;
        }

        /* Form Group */
        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        .form-hint {
            font-size: 0.8rem;
            color: var(--text-tertiary);
            margin-top: 0.25rem;
        }

        /* Chat Interface */
        .chat-container {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 180px);
            background-color: var(--bg-secondary);
            border-radius: 12px;
            overflow: hidden;
        }

        .chat-header {
            padding: 1rem 1.5rem;
            background-color: var(--bg-tertiary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--success);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .chat-message {
            display: flex;
            gap: 0.75rem;
            max-width: 80%;
        }

        .chat-message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .message-avatar {
            display: none;
        }

        .message-content {
            background-color: var(--bg-tertiary);
            padding: 0.5rem 0.75rem;
            border-radius: 12px;
            color: var(--text-primary);
            word-wrap: break-word;
        }

        .chat-message.user .message-content {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
        }

        .message-time {
            font-size: 0.7rem;
            color: var(--text-tertiary);
            margin-top: 0.25rem;
        }

        .chat-input-container {
            padding: 1rem 1.5rem;
            background-color: var(--bg-tertiary);
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
        }

        .chat-input {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid var(--bg-hover);
            border-radius: 8px;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            resize: none;
            max-height: 120px;
            font-family: inherit;
        }

        .chat-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }

        .send-btn {
            padding: 0.75rem 1.25rem;
            background-color: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .send-btn:hover:not(:disabled) {
            background-color: var(--accent-secondary);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Papers List */
        .papers-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .paper-item {
            padding: 0.5rem 0.75rem;
            background-color: var(--bg-tertiary);
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .paper-item:hover {
            background-color: var(--bg-hover);
        }

        .paper-info {
            flex: 1;
            min-width: 0;
        }

        .paper-title {
            font-weight: 500;
            color: var(--text-primary);
            font-size: 0.85rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .paper-meta {
            display: none;
        }

        .paper-actions {
            display: flex;
            gap: 0.5rem;
        }

        .icon-btn {
            padding: 0.5rem;
            background-color: var(--bg-secondary);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.2s;
        }

        .icon-btn:hover {
            background-color: var(--accent-primary);
            color: white;
        }

        /* Upload Zone */
        .upload-zone {
            border-radius: 16px;
            padding: 3rem 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            background-color: var(--bg-tertiary);
            position: relative;
            overflow: hidden;
        }

        .upload-zone::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            padding: 2px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0.3;
        }

        .upload-zone:hover {
            background-color: var(--bg-hover);
            transform: translateY(-2px);
        }

        .upload-zone:hover::before {
            opacity: 0.6;
        }

        .upload-zone.dragover {
            background-color: var(--accent-primary);
            opacity: 0.3;
        }

        .upload-icon {
            font-size: 3rem;
            color: var(--text-tertiary);
            margin-bottom: 1rem;
        }

        .upload-text {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .upload-hint {
            font-size: 0.85rem;
            color: var(--text-tertiary);
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background-color: var(--bg-secondary);
            border-radius: 12px;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .modal-header {
            padding: 1.5rem;
            background-color: var(--bg-tertiary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0.25rem 0.5rem;
        }

        .modal-close:hover {
            color: var(--text-primary);
        }

        .modal-body {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
        }

        /* Toast */
        .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .toast {
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast.success {
            background-color: var(--success);
        }

        .toast.error {
            background-color: var(--error);
        }

        .toast.warning {
            background-color: var(--warning);
        }

        .toast.info {
            background-color: var(--info);
        }

        /* Loading */
        .loading {
            display: inline-flex;
            gap: 0.25rem;
        }

        .loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: currentColor;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        /* Utility Classes */
        .hidden {
            display: none !important;
        }

        .text-center {
            text-align: center;
        }

        .mt-1 { margin-top: 0.5rem; }
        .mt-2 { margin-top: 1rem; }
        .mb-1 { margin-bottom: 0.5rem; }
        .mb-2 { margin-bottom: 1rem; }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--bg-hover);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-tertiary);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 200px;
            }

            .container {
                flex-direction: column;
            }

            .main-content {
                padding: 1rem;
            }

            .chat-message {
                max-width: 90%;
            }
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-tertiary);
        }

        .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        /* Range Slider */
        .range-slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: var(--bg-tertiary);
            outline: none;
            -webkit-appearance: none;
        }

        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
        }

        .range-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
            border: none;
        }

        .range-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: var(--text-tertiary);
            margin-top: 0.5rem;
        }

        /* File selected indicator */
        .file-selected {
            padding: 1rem;
            background-color: var(--bg-tertiary);
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .file-name {
            color: var(--text-primary);
            font-weight: 500;
        }

        .remove-file {
            background: none;
            border: none;
            color: var(--error);
            cursor: pointer;
            font-size: 1.2rem;
        }

        /* Initialization Loading Screen */
        .init-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-primary);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease-out;
        }

        .init-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .init-content {
            text-align: center;
            padding: 2rem;
        }

        .init-logo {
            width: 80px;
            height: 80px;
            background-color: var(--accent-primary);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            font-size: 2.5rem;
            color: white;
            font-weight: bold;
            animation: pulse-logo 2s ease-in-out infinite;
        }

        @keyframes pulse-logo {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 20px rgba(74, 144, 226, 0);
            }
        }

        .init-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .init-subtitle {
            font-size: 1rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }

        .init-spinner {
            display: inline-flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .init-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--accent-primary);
            animation: bounce-init 1.4s infinite ease-in-out both;
        }

        .init-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .init-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce-init {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .init-message {
            font-size: 0.9rem;
            color: var(--text-tertiary);
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <!-- Initialization Loading Screen -->
    <div class="init-overlay" id="initOverlay">
        <div class="init-content">
            <div class="init-logo">AI</div>
            <h1 class="init-title">AI Research Assistant</h1>
            <p class="init-subtitle">Intelligent Paper Analysis</p>
            <div class="init-spinner">
                <div class="init-dot"></div>
                <div class="init-dot"></div>
                <div class="init-dot"></div>
            </div>
            <p class="init-message">Initializing AI agent...</p>
        </div>
    </div>

    <!-- Header -->
    <header class="header">
        <div class="logo">
            <div class="logo-icon">AI</div>
            <div class="logo-text">
                <h1>AI Research Assistant</h1>
                <p>Intelligent Paper Analysis</p>
            </div>
        </div>
        <div class="header-actions">
            <button class="header-nav active" data-page="chat">
                <span>💬</span> <span>Chat</span>
            </button>
            <button class="header-nav" data-page="upload">
                <span>📤</span> <span>Upload</span>
            </button>
            <button class="header-nav" data-page="instructions">
                <span>📝</span> <span>Instructions</span>
            </button>
            <button class="header-nav" data-page="config">
                <span>⚙️</span> <span>Config</span>
            </button>
            <button class="theme-toggle" id="themeToggle">
                <span id="themeIcon">🌙</span> <span id="themeText">Dark</span>
            </button>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <!-- New Chat Button (Static) -->
            <button class="new-chat-btn" id="newChatBtn">
                ✨ New Chat
            </button>

            <div class="nav-section" id="papersSidebar">
                <h3 onclick="toggleSection('papers')">
                    <span>Documents</span>
                    <i class="fa-solid fa-chevron-down collapse-icon" id="papersIcon"></i>
                </h3>
                <div id="papersList" class="papers-list collapsible-content collapsed">
                    <div class="empty-state">
                        <div class="empty-icon">📄</div>
                        <p>No documents uploaded</p>
                    </div>
                </div>
            </div>

            <div class="nav-section" id="historySidebar">
                <h3 onclick="toggleSection('history')">
                    <span>Chat History</span>
                    <i class="fa-solid fa-chevron-down collapse-icon" id="historyIcon"></i>
                </h3>
                <div id="historyList" class="papers-list collapsible-content collapsed">
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <p>No chat history</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Chat Page -->
            <div id="chatPage" class="page-content">
                <div class="chat-container">
                    <div class="chat-header">
                        <div>
                            <h3 style="color: var(--text-primary); margin-bottom: 0.25rem;">AI Assistant</h3>
                            <div class="chat-status">
                                <span class="status-dot"></span>
                                <span>Ready to help</span>
                            </div>
                        </div>
                        <div class="follow-up-toggle">
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Follow-up</span>
                            <div class="toggle-switch active" id="followUpToggle">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="empty-state">
                            <div class="empty-icon">💬</div>
                            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Welcome to AI Research Assistant</h3>
                            <p>Upload your research papers and start asking questions.</p>
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <textarea 
                            class="chat-input" 
                            id="chatInput" 
                            placeholder="Ask me about your research papers..."
                            rows="1"
                        ></textarea>
                        <button class="send-btn" id="sendBtn">
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Upload Page -->
            <div id="uploadPage" class="page-content hidden">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <span>📤</span>
                            Upload Research Paper
                        </h2>
                    </div>
                    <div>
                        <div class="upload-zone" id="uploadZone">
                            <div class="upload-icon">📄</div>
                            <div class="upload-text">Drag and drop your PDF or TXT file here</div>
                            <div class="upload-hint">or click to browse</div>
                            <input type="file" id="fileInput" accept=".pdf,.txt" style="display: none;">
                        </div>
                        <div id="fileSelected" class="file-selected hidden">
                            <span class="file-name" id="fileName"></span>
                            <button class="remove-file" id="removeFile">×</button>
                        </div>
                        <button class="btn btn-primary mt-2" id="uploadBtn" style="width: 100%;" disabled>
                            <span>📤</span>
                            <span>Upload Paper</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Instructions Page -->
            <div id="instructionsPage" class="page-content hidden">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <span>📝</span>
                            AI Instructions
                        </h2>
                    </div>
                    <div>
                        <div class="form-group">
                            <label class="form-label">Current System Instructions</label>
                            <textarea class="input" id="currentInstructions" readonly rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Additional Custom Instructions</label>
                            <textarea class="input" id="customInstructions" placeholder="Enter your custom instructions here..." rows="6"></textarea>
                            <div class="form-hint">Your instructions will be appended to the base system message</div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-secondary" id="cancelInstructions">Cancel</button>
                            <button class="btn btn-primary" id="updateInstructions">
                                <span>✓</span>
                                <span>Update Instructions</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Config Page -->
            <div id="configPage" class="page-content hidden">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <span>⚙️</span>
                            LLM Configuration
                        </h2>
                    </div>
                    <div>
                        <div class="form-group">
                            <label class="form-label">Model Provider</label>
                            <select class="input" id="modelType">
                                <option value="openai">OpenAI</option>
                                <option value="openai_style_gaudi">OpenAI Style (Gaudi)</option>
                                <option value="openai_style_amd">OpenAI Style (AMD)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Model Name</label>
                            <select class="input" id="modelName">
                                <option value="gpt-4o">gpt-4o</option>
                                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                <option value="gpt-4">gpt-4</option>
                                <option value="gpt-4-turbo">gpt-4-turbo</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">API Key</label>
                            <input type="password" class="input" id="apiKey" placeholder="Enter your API key">
                        </div>
                        <div class="form-group" id="apiUrlGroup" style="display: none;">
                            <label class="form-label">API URL</label>
                            <input type="text" class="input" id="apiUrl" placeholder="Enter API endpoint URL">
                            <div class="form-hint">Specify the base URL for API requests</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Temperature: <span id="tempValue">0</span></label>
                            <input type="range" class="range-slider" id="temperature" min="0" max="2" step="0.1" value="0">
                            <div class="range-labels">
                                <span>0 (Deterministic)</span>
                                <span>1 (Balanced)</span>
                                <span>2 (Creative)</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button class="btn btn-secondary" id="cancelConfig">Cancel</button>
                            <button class="btn btn-primary" id="saveConfig">
                                <span>✓</span>
                                <span>Save Configuration</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- File Preview Modal -->
    <div class="modal" id="fileModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modalFileName">File Preview</h3>
                <button class="modal-close" id="closeModal">×</button>
            </div>
            <div class="modal-body">
                <iframe id="fileFrame" style="width: 100%; height: 600px; border: none;"></iframe>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer"></div>

    <script>
        // ==================== STATE MANAGEMENT ====================
        const state = {
            currentPage: 'chat',
            theme: localStorage.getItem('theme') || 'light',
            chatHistory: [],
            papers: [],
            messages: [],
            currentThreadId: '',
            followUpEnabled: true,
            config: null,
            selectedFile: null,
            isLoading: false
        };

        // ==================== UTILITY FUNCTIONS ====================
        function generateId() {
            return Math.random().toString(36).substr(2, 9);
        }

        function generateThreadId() {
            const now = new Date();
            const timestamp = now.getFullYear().toString() +
                             (now.getMonth() + 1).toString().padStart(2, '0') +
                             now.getDate().toString().padStart(2, '0') +
                             now.getHours().toString().padStart(2, '0') +
                             now.getMinutes().toString().padStart(2, '0') +
                             now.getSeconds().toString().padStart(2, '0');
            const randomId = Math.random().toString(36).substring(2, 10);
            return `research_agent_${timestamp}_${randomId}`;
        }

        function generateFileId(fileName) {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const sanitized = fileName.replace(/[^a-zA-Z0-9]/g, '_');
            return `${sanitized}_${timestamp}_${random}`;
        }

        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // ==================== TOAST NOTIFICATIONS ====================
        function showToast(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span>${message}</span>
            `;
            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 4000);
        }

        // ==================== THEME MANAGEMENT ====================
        function initTheme() {
            document.documentElement.setAttribute('data-theme', state.theme);
            updateThemeButton();
        }

        function toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
            document.documentElement.setAttribute('data-theme', state.theme);
            updateThemeButton();
        }

        function updateThemeButton() {
            const icon = document.getElementById('themeIcon');
            const text = document.getElementById('themeText');
            if (state.theme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'Light';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Dark';
            }
        }

        // ==================== API FUNCTIONS ====================
        async function apiCall(endpoint, options = {}) {
            try {
                const response = await fetch(endpoint, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                if (!response.ok && !options.skipErrorCheck) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response;
            } catch (error) {
                console.error('API call error:', error);
                throw error;
            }
        }

        async function getAgentConfig() {
            try {
                const response = await apiCall('/temp/ai-research-agent/get-config');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error getting config:', error);
                return { success: false, error: error.message };
            }
        }

        async function updateAgentConfig(config) {
            try {
                const response = await apiCall('/temp/ai-research-agent/update-config', {
                    method: 'POST',
                    body: JSON.stringify(config)
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error updating config:', error);
                return { success: false, error: error.message };
            }
        }

        async function uploadPaper(file, fileId) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileId', fileId);

                const response = await fetch('/temp/ai-research-agent/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error uploading paper:', error);
                return { success: false, error: error.message };
            }
        }

        async function updateConfigForFileUpload(fileName, fileId) {
            try {
                const configResponse = await getAgentConfig();
                if (!configResponse.success) {
                    return { success: false, error: 'Failed to get current configuration' };
                }

                const currentConfig = configResponse.data;
                const currentAgent = currentConfig.agent_workflow?.agents?.[0];
                const currentSystemMessage = currentAgent?.system_message || '';

                const databasePickerInstructions = " First, use the `database_picker` tool to perform a vector search for relevant research information based on the user's query. If the vector search does not return any suitable results, then use the Arxiv tool to retrieve and process academic papers, extracting key findings, methodologies, and references. Clearly mention in your response whether the information was retrieved using the Arxiv tool.";

                const updatedSystemMessage = currentSystemMessage.includes('database_picker')
                    ? currentSystemMessage
                    : `${currentSystemMessage}${databasePickerInstructions}`;

                const newFilePath = `user_storage/ResearchDocs/${fileName}`;

                const updatedConfig = {
                    ...currentConfig,
                    agent_workflow: {
                        ...currentConfig.agent_workflow,
                        agents: {
                            ...currentConfig.agent_workflow.agents,
                            "0": {
                                ...currentAgent,
                                system_message: updatedSystemMessage,
                                tools: {
                                    ...currentAgent.tools,
                                    "1": {
                                        name: "retriever",
                                        collection_name: "ResearchDocs",
                                        files_path: [newFilePath],
                                        file_id: [fileId],
                                        base_directory: "private"
                                    }
                                }
                            }
                        }
                    }
                };

                return await updateAgentConfig(updatedConfig);
            } catch (error) {
                console.error('Error updating config for file upload:', error);
                return { success: false, error: error.message };
            }
        }

        async function getAllPapers() {
            try {
                const response = await apiCall('/temp/ai-research-agent/get-data');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error getting papers:', error);
                return { success: false, error: error.message };
            }
        }

        async function sendChatMessage(message) {
            try {
                const payload = {
                    searchText: message,
                    sessionid: generateUUID(),
                    user_id: generateUUID(),
                    flow_id: "research_agent"
                };

                const response = await apiCall('/research_agent_chat', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                // First try to get response as text
                const textResponse = await response.text();
                
                // Try to parse as JSON
                try {
                    const data = JSON.parse(textResponse);
                    
                    // Check for response in various fields
                    const possibleResponse = data.response || data.message || data.answer || 
                                           data.result || data.text || data.content;
                    
                    if (possibleResponse && typeof possibleResponse === 'string') {
                        // Remove trailing {} if present
                        return possibleResponse.replace(/\s*\{\}\s*$/, '').trim();
                    }
                    
                    // If data is an empty object or array, return a default message
                    if (data && typeof data === 'object') {
                        const stringified = JSON.stringify(data);
                        if (stringified === '{}' || stringified === '[]') {
                            return 'I received your message but had trouble generating a response. Please try again.';
                        }
                        // Remove trailing {} from stringified response
                        return stringified.replace(/\s*\{\}\s*$/, '').trim();
                    }
                } catch (parseError) {
                    // If JSON parsing fails, treat as plain text response
                    if (textResponse && textResponse.trim()) {
                        // Remove trailing {} if present
                        return textResponse.replace(/\s*\{\}\s*$/, '').trim();
                    }
                }
                
                return 'I received your message but had trouble generating a response. Please try again.';
            } catch (error) {
                console.error('Error sending chat message:', error);
                throw error;
            }
        }

        // ==================== WARM-UP AND TRIGGER API ====================
        // Warm start agent - stream-safe initialization with 3-minute timeout
        async function warmStartAgent(config, timeoutMs = 180000) {
            try {
                const payload = {
                    ...config,
                    question: 'Warm start',
                    warmup: true,
                    no_stream: true
                };

                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);

                try {
                    const res = await fetch('/trigger-research-agent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'text/event-stream, application/json'
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });

                    if (res.body) {
                        const reader = res.body.getReader();
                        try {
                            await reader.read();
                        } catch (e) {
                            // Ignore read/abort errors
                        } finally {
                            reader.releaseLock();
                        }
                    }

                    return { success: true };
                } finally {
                    clearTimeout(timer);
                    controller.abort();
                }
            } catch (error) {
                console.error('Warm start error:', error);
                return { success: false, error: 'Warm start failed or aborted' };
            }
        }

        // Trigger AI agent with configuration
        async function triggerAIAgentWithConfig(config, question) {
            try {
                const configToUse = config || (await getAgentConfig()).data;
                
                if (!configToUse) {
                    return { success: false, error: 'Failed to get agent configuration' };
                }

                const apiKey = configToUse.agent_workflow?.agents?.[0]?.llm?.api_key;
                if (!apiKey || apiKey.trim() === '') {
                    return { success: false, error: 'Please configure your API key in the Config tab' };
                }

                const configWithParams = {
                    ...configToUse,
                    question: question
                };

                const response = await fetch('/trigger-research-agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(configWithParams)
                });

                const data = await response.json();
                return { success: true, data: data };
            } catch (error) {
                console.error('Trigger AI Agent error:', error);
                return { success: false, error: 'Failed to trigger AI agent' };
            }
        }

        // Initialize AI agent on startup
        async function initializeAIAgent() {
            try {
                console.log('Checking AI agent configuration on startup...');
                
                const configResponse = await getAgentConfig();
                
                if (!configResponse.success) {
                    console.warn('Failed to get configuration:', configResponse.error);
                    return;
                }

                const config = configResponse.data;
                const llmConfig = config?.agent_workflow?.agents?.[0]?.llm;

                if (!llmConfig || !llmConfig.api_key || llmConfig.api_key.trim() === '') {
                    console.log('LLM configuration incomplete - API key missing');
                    return;
                }

                if (!llmConfig.model_type || !llmConfig.model_name) {
                    console.log('LLM configuration incomplete - model type or name missing');
                    return;
                }

                console.log('LLM configuration is complete. Performing warm start...');

                // Clear retriever tool arrays before warm start
                const configForTrigger = {
                    ...config,
                    agent_workflow: {
                        ...config.agent_workflow,
                        agents: {
                            ...config.agent_workflow.agents,
                            "0": {
                                ...config.agent_workflow.agents["0"],
                                tools: Object.fromEntries(
                                    Object.entries(config.agent_workflow.agents["0"].tools || {}).map(
                                        ([key, tool]) => {
                                            if (tool.name === "retriever") {
                                                return [key, {
                                                    ...tool,
                                                    files_path: [],
                                                    file_id: []
                                                }];
                                            }
                                            return [key, tool];
                                        }
                                    )
                                )
                            }
                        }
                    }
                };

                console.log('Set empty files_path and file_id for retriever tool in startup trigger');

                const warmupResponse = await warmStartAgent(configForTrigger, 180000);

                if (warmupResponse.success) {
                    console.log('AI agent warm start completed');
                } else {
                    console.warn('AI agent warm start failed:', warmupResponse.error);
                }

            } catch (error) {
                console.error('Error initializing AI agent on startup:', error);
            }
        }

        async function summarizeFile(fileId, onChunk) {
            try {
                const configResponse = await getAgentConfig();
                if (!configResponse.success) {
                    return { success: false, error: 'Failed to get configuration' };
                }

                const llmConfig = configResponse.data?.agent_workflow?.agents?.[0]?.llm;

                if (!llmConfig?.api_key || llmConfig.api_key.trim() === '') {
                    return { success: false, error: 'Please configure your API key in the Config tab' };
                }

                const payload = {
                    llm_config: {
                        model_type: llmConfig.model_type || "openai",
                        model_name: llmConfig.model_name || "gpt-4o",
                        api_key: llmConfig.api_key,
                        temperature: llmConfig.temperature || 0.6,
                        ...(llmConfig.model_type === 'openai_style' && llmConfig.api_url ? { api_url: llmConfig.api_url } : {})
                    },
                    vdb_config: {
                        file_id: fileId,
                        collection_name: "ResearchDocs"
                    }
                };

                const response = await fetch('/research_agent_file_summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error('No response body reader available');
                }

                let raw = '';
                let normalized = '';
                const decoder = new TextDecoder();

                const normalizeMarkdown = (text) => {
                    let s = text;
                    s = s.replace(/[ \t]{2,}/g, ' ');
                    s = s.replace(/\s+([.,:;!?])/g, '$1');
                    s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
                    s = s.replace(/[ \t]+\n/g, '\n');
                    s = s.replace(/\*\*\s+/g, '**').replace(/\s+\*\*/g, '**');
                    s = s.replace(/([A-Za-z0-9])\s*-\s*([A-Za-z0-9])/g, '$1-$2');
                    return s;
                };

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            const trimmed = line.trim();

                            if (trimmed.startsWith('event:')) {
                                if (trimmed === 'event: end') {
                                    return { success: true, data: normalized.trim() };
                                }
                                continue;
                            }

                            if (trimmed.startsWith('data:')) {
                                let data = trimmed.slice(5).trimStart();

                                if (data === '[DONE]') {
                                    return { success: true, data: normalized.trim() };
                                }

                                let segment = '';
                                if (data === '') {
                                    segment = '\n\n';
                                } else if (data === '-') {
                                    segment = '\n- ';
                                } else {
                                    segment = data + ' ';
                                }

                                raw += segment;

                                const newNormalized = normalizeMarkdown(raw);
                                const delta = newNormalized.slice(normalized.length);
                                if (delta && onChunk) {
                                    onChunk(delta);
                                }
                                normalized = newNormalized;
                            }
                        }
                    }

                    return { success: true, data: normalized.trim() };
                } finally {
                    reader.releaseLock();
                }
            } catch (error) {
                console.error('Summarization error:', error);
                return { success: false, error: 'Failed to summarize file' };
            }
        }

        // ==================== UI RENDERING ====================
        function renderPapersList() {
            const container = document.getElementById('papersList');
            
            if (state.papers.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📄</div>
                        <p>No papers uploaded yet</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = state.papers.map(paper => `
                <div class="paper-item" data-paper-id="${paper.id || paper.fileId}">
                    <div class="paper-info">
                        <div class="paper-title">${paper.originalFileName || paper.title || 'Untitled'}</div>
                    </div>
                    <div class="paper-actions">
                        <button class="icon-btn" onclick="handleSummarize('${paper.fileId}')" title="Summarize">
                            📝
                        </button>
                        <button class="icon-btn" onclick="handlePreview('${paper.originalFileName || paper.title}')" title="Preview">
                            👁️
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function renderChatHistory() {
            const container = document.getElementById('historyList');
            const history = state.chatHistory;
            
            const hasHistory = history.today?.length > 0 || history.yesterday?.length > 0 || 
                              history.previous7Days?.length > 0 || history.previous30Days?.length > 0;
            
            if (!hasHistory) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <p>No chat history</p>
                    </div>
                `;
                return;
            }
            
            const expandedSections = {
                today: document.getElementById('todayContent')?.classList.contains('collapsed') === false,
                yesterday: document.getElementById('yesterdayContent')?.classList.contains('collapsed') === false,
                previous7Days: document.getElementById('previous7DaysContent')?.classList.contains('collapsed') === false,
                previous30Days: document.getElementById('previous30DaysContent')?.classList.contains('collapsed') === false
            };
            
            let html = '';
            
            if (history.today && history.today.length > 0) {
                html += `
                    <div class="history-category">
                        <h4 onclick="toggleHistoryCategory('todayContent')">
                            <span>Today</span>
                            <i class="fa-solid fa-chevron-down collapse-icon" id="todayContentIcon"></i>
                        </h4>
                        <div id="todayContent" class="history-category-content collapsed">
                `;
                history.today.forEach(session => {
                    html += `
                        <div class="history-item" onclick="handleHistoryItemClick('${session.session_id}')" style="cursor: pointer;">
                            <div class="history-title">${session.title || session.preview || 'Conversation'}</div>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
            
            if (history.yesterday && history.yesterday.length > 0) {
                html += `
                    <div class="history-category">
                        <h4 onclick="toggleHistoryCategory('yesterdayContent')">
                            <span>Yesterday</span>
                            <i class="fa-solid fa-chevron-down collapse-icon" id="yesterdayContentIcon"></i>
                        </h4>
                        <div id="yesterdayContent" class="history-category-content collapsed">
                `;
                history.yesterday.forEach(session => {
                    html += `
                        <div class="history-item" onclick="handleHistoryItemClick('${session.session_id}')" style="cursor: pointer;">
                            <div class="history-title">${session.title || session.preview || 'Conversation'}</div>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
            
            if (history.previous7Days && history.previous7Days.length > 0) {
                html += `
                    <div class="history-category">
                        <h4 onclick="toggleHistoryCategory('previous7DaysContent')">
                            <span>Previous 7 Days</span>
                            <i class="fa-solid fa-chevron-down collapse-icon" id="previous7DaysContentIcon"></i>
                        </h4>
                        <div id="previous7DaysContent" class="history-category-content collapsed">
                `;
                history.previous7Days.forEach(session => {
                    html += `
                        <div class="history-item" onclick="handleHistoryItemClick('${session.session_id}')" style="cursor: pointer;">
                            <div class="history-title">${session.title || session.preview || 'Conversation'}</div>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
            
            if (history.previous30Days && history.previous30Days.length > 0) {
                html += `
                    <div class="history-category">
                        <h4 onclick="toggleHistoryCategory('previous30DaysContent')">
                            <span>Previous 30 Days</span>
                            <i class="fa-solid fa-chevron-down collapse-icon" id="previous30DaysContentIcon"></i>
                        </h4>
                        <div id="previous30DaysContent" class="history-category-content collapsed">
                `;
                history.previous30Days.forEach(session => {
                    html += `
                        <div class="history-item" onclick="handleHistoryItemClick('${session.session_id}')" style="cursor: pointer;">
                            <div class="history-title">${session.title || session.preview || 'Conversation'}</div>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
            
            container.innerHTML = html;
            
            if (expandedSections.today) {
                const todayContent = document.getElementById('todayContent');
                const todayIcon = document.getElementById('todayContentIcon');
                if (todayContent && todayIcon) {
                    todayContent.classList.remove('collapsed');
                    todayIcon.classList.remove('fa-chevron-down');
                    todayIcon.classList.add('fa-chevron-up');
                }
            }
            if (expandedSections.yesterday) {
                const yesterdayContent = document.getElementById('yesterdayContent');
                const yesterdayIcon = document.getElementById('yesterdayContentIcon');
                if (yesterdayContent && yesterdayIcon) {
                    yesterdayContent.classList.remove('collapsed');
                    yesterdayIcon.classList.remove('fa-chevron-down');
                    yesterdayIcon.classList.add('fa-chevron-up');
                }
            }
            if (expandedSections.previous7Days) {
                const previous7DaysContent = document.getElementById('previous7DaysContent');
                const previous7DaysIcon = document.getElementById('previous7DaysContentIcon');
                if (previous7DaysContent && previous7DaysIcon) {
                    previous7DaysContent.classList.remove('collapsed');
                    previous7DaysIcon.classList.remove('fa-chevron-down');
                    previous7DaysIcon.classList.add('fa-chevron-up');
                }
            }
            if (expandedSections.previous30Days) {
                const previous30DaysContent = document.getElementById('previous30DaysContent');
                const previous30DaysIcon = document.getElementById('previous30DaysContentIcon');
                if (previous30DaysContent && previous30DaysIcon) {
                    previous30DaysContent.classList.remove('collapsed');
                    previous30DaysIcon.classList.remove('fa-chevron-down');
                    previous30DaysIcon.classList.add('fa-chevron-up');
                }
            }
        }

        function toggleHistoryCategory(categoryId) {
            const content = document.getElementById(categoryId);
            const icon = document.getElementById(`${categoryId}Icon`);
            
            if (content && icon) {
                content.classList.toggle('collapsed');
                
                if (icon.classList.contains('fa-chevron-up')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        }

        function toggleSection(sectionName) {
            const content = document.getElementById(`${sectionName}List`);
            const icon = document.getElementById(`${sectionName}Icon`);
            
            if (content && icon) {
                content.classList.toggle('collapsed');
                
                if (icon.classList.contains('fa-chevron-up')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        }

        async function getChatHistory(flowId) {
            try {
                const response = await apiCall(`/api/agent-chat-logs?flow_id=${flowId}&include_preview=true`);
                const data = await response.json();
                
                return { 
                    success: true, 
                    data: {
                        today: data.today || [],
                        yesterday: data.yesterday || [],
                        previous7Days: data.previous7Days || [],
                        previous30Days: data.previous30Days || []
                    }
                };
            } catch (error) {
                console.error('Error getting chat history:', error);
                return { success: false, error: error.message };
            }
        }

        async function loadChatHistory() {
            try {
                const response = await getChatHistory('research_agent');
                if (response.success && response.data) {
                    state.chatHistory = response.data;
                    renderChatHistory();
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }

        async function handleHistoryItemClick(sessionId) {
            try {
                const response = await apiCall(`/api/agent-chat-logs/get/${sessionId}?flow_id=research_agent`);
                const history = await response.json();
                
                state.currentThreadId = sessionId;
                state.messages = [];

                if (history && Array.isArray(history)) {
                    history.forEach(msg => {
                        if (msg.user && msg.user.mssg) {
                            addMessage(msg.user.mssg, true);
                        }
                        if (msg.bot && msg.bot.mssg) {
                            addMessage(msg.bot.mssg, false);
                        }
                    });
                }

                renderChatHistory();
            } catch (error) {
                console.error('Error loading chat history:', error);
                showToast('Failed to load chat history', 'error');
            }
        }

        function showConfigPrompt() {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.minWidth = '350px';
            toast.style.backgroundColor = 'var(--bg-secondary)';
            toast.style.color = 'var(--text-primary)';
            toast.style.border = '2px solid var(--accent-primary)';
            toast.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">⚠️</span>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">Configuration Required</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Please set up your API key to use this feature.</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button onclick="this.closest('.toast').remove()" style="padding: 0.4rem 0.8rem; background: var(--bg-tertiary); border: none; border-radius: 4px; color: var(--text-primary); cursor: pointer; font-size: 0.85rem; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--bg-hover)'" onmouseout="this.style.backgroundColor='var(--bg-tertiary)'">Cancel</button>
                        <button onclick="switchPage('config'); this.closest('.toast').remove();" style="padding: 0.4rem 0.8rem; background: var(--accent-primary); border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--accent-secondary)'" onmouseout="this.style.backgroundColor='var(--accent-primary)'">Go to Config</button>
                    </div>
                </div>
            `;
            container.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 8000);
        }

        async function checkConfigAndShowPrompt() {
            try {
                const configResponse = await getAgentConfig();
                if (!configResponse.success) {
                    return false;
                }

                const llmConfig = configResponse.data?.agent_workflow?.agents?.[0]?.llm;
                if (!llmConfig?.api_key || llmConfig.api_key.trim() === '') {
                    showConfigPrompt();
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Error checking config:', error);
                return false;
            }
        }

        function renderChatMessages() {
            const container = document.getElementById('chatMessages');
            
            if (state.messages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">💬</div>
                        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Welcome to AI Research Assistant</h3>
                        <p>Upload your research papers and start asking questions.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = state.messages.map(msg => `
                <div class="chat-message ${msg.isUser ? 'user' : 'ai'}">
                    <div class="message-avatar ${msg.isUser ? 'user' : 'ai'}">
                        ${msg.isUser ? '👤' : '🤖'}
                    </div>
                    <div>
                        <div class="message-content">${formatMessage(msg.content)}</div>
                        <div class="message-time">${formatTime(msg.timestamp)}</div>
                    </div>
                </div>
            `).join('');

            container.scrollTop = container.scrollHeight;
        }

        function formatMessage(content) {
            // Simple markdown-like formatting
            let formatted = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
            return formatted;
        }

        function addMessage(content, isUser = false) {
            const message = {
                id: generateId(),
                content,
                isUser,
                timestamp: new Date()
            };
            state.messages.push(message);
            renderChatMessages();
            return message;
        }

        function updateLastMessage(content) {
            if (state.messages.length > 0) {
                state.messages[state.messages.length - 1].content = content;
                renderChatMessages();
            }
        }

        function showLoadingMessage() {
            const container = document.getElementById('chatMessages');
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'chat-message ai';
            loadingDiv.id = 'loadingMessage';
            loadingDiv.innerHTML = `
                <div class="message-avatar ai">🤖</div>
                <div>
                    <div class="message-content">
                        <div class="loading">
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(loadingDiv);
            container.scrollTop = container.scrollHeight;
        }

        function removeLoadingMessage() {
            const loading = document.getElementById('loadingMessage');
            if (loading) {
                loading.remove();
            }
        }

        // ==================== PAGE NAVIGATION ====================
        function switchPage(pageName) {
            // Update header nav items
            document.querySelectorAll('.header-nav').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageName) {
                    item.classList.add('active');
                }
            });

            // Update page content
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.add('hidden');
            });
            document.getElementById(`${pageName}Page`).classList.remove('hidden');

            state.currentPage = pageName;

            // Load data for specific pages
            if (pageName === 'instructions') {
                loadInstructions();
            } else if (pageName === 'config') {
                loadConfig();
            } else if (pageName === 'chat') {
                loadChatHistory();
            }
        }

        // ==================== CHAT HANDLERS ====================
        function handleNewChat() {
            state.messages = [];
            state.currentThreadId = generateThreadId();
            renderChatMessages();
            switchPage('chat');
            showToast('New chat started', 'info');
        }

        function handleFollowUpToggle() {
            state.followUpEnabled = !state.followUpEnabled;
            const toggle = document.getElementById('followUpToggle');
            
            if (state.followUpEnabled) {
                toggle.classList.add('active');
                showToast('Follow-up mode enabled', 'info');
            } else {
                toggle.classList.remove('active');
                showToast('Follow-up mode disabled', 'info');
                state.currentThreadId = generateThreadId();
            }
        }

        async function handleSendMessage() {
            const input = document.getElementById('chatInput');
            const sendBtn = document.getElementById('sendBtn');
            const message = input.value.trim();

            if (!message || state.isLoading) return;

            const hasConfig = await checkConfigAndShowPrompt();
            if (!hasConfig) {
                return;
            }

            // Add user message
            addMessage(message, true);
            input.value = '';

            // Disable input and button during AI response
            state.isLoading = true;
            input.disabled = true;
            sendBtn.disabled = true;
            showLoadingMessage();

            try {
                const response = await sendChatMessage(message);
                removeLoadingMessage();
                addMessage(response, false);
                
                await loadChatHistory();
            } catch (error) {
                removeLoadingMessage();
                addMessage('Sorry, I encountered an error. Please try again.', false);
                showToast('Failed to send message', 'error');
            } finally {
                // Re-enable input and button after response
                state.isLoading = false;
                input.disabled = false;
                sendBtn.disabled = false;
                input.focus();
            }
        }

        async function handleSummarize(fileId) {
            if (!fileId) {
                showToast('File ID not found', 'error');
                return;
            }

            // Switch to chat page
            switchPage('chat');

            const input = document.getElementById('chatInput');
            const sendBtn = document.getElementById('sendBtn');

            // Disable input during summarization
            state.isLoading = true;
            input.disabled = true;
            sendBtn.disabled = true;

            // Add initial message
            const initialMsg = addMessage('**File Summary**\n\nGenerating summary...', false);

            try {
                let streamedContent = '**File Summary**\n\n';

                await summarizeFile(fileId, (chunk) => {
                    streamedContent += chunk;
                    updateLastMessage(streamedContent);
                });

                showToast('File summarized successfully!', 'success');
            } catch (error) {
                updateLastMessage('Sorry, I couldn\'t summarize the file. Please try again.');
                showToast('Failed to summarize file', 'error');
            } finally {
                // Re-enable input after summarization
                state.isLoading = false;
                input.disabled = false;
                sendBtn.disabled = false;
            }
        }

        function handlePreview(fileName) {
            const modal = document.getElementById('fileModal');
            const frame = document.getElementById('fileFrame');
            const title = document.getElementById('modalFileName');

            title.textContent = fileName;
            frame.src = `/temp/ai-research-agent/get-file-content/${encodeURIComponent(fileName)}`;
            modal.classList.add('active');
        }

        // ==================== UPLOAD HANDLERS ====================
        function handleFileSelect(file) {
            if (!file) return;

            state.selectedFile = file;
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSelected').classList.remove('hidden');
            document.getElementById('uploadBtn').disabled = false;
        }

        function handleRemoveFile() {
            state.selectedFile = null;
            document.getElementById('fileSelected').classList.add('hidden');
            document.getElementById('uploadBtn').disabled = true;
            document.getElementById('fileInput').value = '';
        }

        async function handleUpload() {
            if (!state.selectedFile) {
                showToast('Please select a file', 'error');
                return;
            }

            // Check if config is set up before uploading
            const hasConfig = await checkConfigAndShowPrompt();
            if (!hasConfig) {
                return;
            }

            const uploadBtn = document.getElementById('uploadBtn');
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<span>⏳</span><span>Uploading...</span>';

            try {
                const fileId = generateFileId(state.selectedFile.name);

                // Upload file
                const uploadResponse = await uploadPaper(state.selectedFile, fileId);
                if (!uploadResponse.success) {
                    throw new Error(uploadResponse.error || 'Failed to upload paper');
                }

                // Update config
                const configUpdateResponse = await updateConfigForFileUpload(state.selectedFile.name, fileId);
                if (!configUpdateResponse.success) {
                    console.warn('Failed to update configuration:', configUpdateResponse.error);
                }

                uploadBtn.innerHTML = '<span>⏳</span><span>Processing...</span>';

                // Get updated config and trigger AI agent
                const updatedConfigResponse = await getAgentConfig();
                if (updatedConfigResponse.success) {
                    // Clear retriever tool arrays before triggering
                    const configForTrigger = {
                        ...updatedConfigResponse.data,
                        agent_workflow: {
                            ...updatedConfigResponse.data.agent_workflow,
                            agents: {
                                ...updatedConfigResponse.data.agent_workflow.agents,
                                "0": {
                                    ...updatedConfigResponse.data.agent_workflow.agents["0"],
                                    tools: Object.fromEntries(
                                        Object.entries(updatedConfigResponse.data.agent_workflow.agents["0"].tools || {}).map(
                                            ([key, tool]) => {
                                                if (tool.name === "retriever") {
                                                    return [key, {
                                                        ...tool,
                                                        files_path: [],
                                                        file_id: []
                                                    }];
                                                }
                                                return [key, tool];
                                            }
                                        )
                                    )
                                }
                            }
                        }
                    };

                    try {
                        const triggerResponse = await triggerAIAgentWithConfig(configForTrigger, 'Processing uploaded file');
                        if (triggerResponse.success) {
                            showToast('Document uploaded and processed successfully!', 'success');
                        } else {
                            showToast('Document uploaded but processing failed', 'warning');
                        }
                    } catch (triggerError) {
                        console.warn('Trigger API error:', triggerError);
                        showToast('Document uploaded but processing failed', 'warning');
                    }
                } else {
                    showToast('Paper uploaded successfully!', 'success');
                }

                // Refresh papers list
                await loadPapers();

                // Reset form
                handleRemoveFile();
                switchPage('chat');
            } catch (error) {
                showToast(error.message || 'Failed to upload paper', 'error');
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<span>📤</span><span>Upload Paper</span>';
            }
        }

        // ==================== INSTRUCTIONS HANDLERS ====================
        async function loadInstructions() {
            try {
                const response = await getAgentConfig();
                if (response.success && response.data) {
                    const systemMessage = response.data.agent_workflow?.agents?.[0]?.system_message || '';
                    document.getElementById('currentInstructions').value = systemMessage;
                }
            } catch (error) {
                showToast('Failed to load instructions', 'error');
            }
        }

        async function handleUpdateInstructions() {
            const customInstructions = document.getElementById('customInstructions').value.trim();

            if (!customInstructions) {
                showToast('Please enter custom instructions', 'error');
                return;
            }

            // Check if config is set up before updating instructions
            const hasConfig = await checkConfigAndShowPrompt();
            if (!hasConfig) {
                return;
            }

            const btn = document.getElementById('updateInstructions');
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span><span>Updating...</span>';

            try {
                const configResponse = await getAgentConfig();
                if (!configResponse.success) {
                    throw new Error('Failed to get current configuration');
                }

                const currentAgent = configResponse.data.agent_workflow?.agents?.[0];
                const currentSystemMessage = currentAgent?.system_message || '';
                const updatedSystemMessage = `${currentSystemMessage} Additional Instructions: ${customInstructions}`;

                // Clear retriever tool arrays
                let updatedTools = { ...currentAgent.tools };
                if (updatedTools["1"] && updatedTools["1"].name === "retriever") {
                    updatedTools["1"] = {
                        ...updatedTools["1"],
                        files_path: [],
                        file_id: []
                    };
                }

                const updatedConfig = {
                    ...configResponse.data,
                    agent_workflow: {
                        ...configResponse.data.agent_workflow,
                        agents: {
                            ...configResponse.data.agent_workflow.agents,
                            "0": {
                                ...currentAgent,
                                system_message: updatedSystemMessage,
                                tools: updatedTools
                            }
                        }
                    }
                };

                const updateResponse = await updateAgentConfig(updatedConfig);
                if (!updateResponse.success) {
                    throw new Error('Failed to update configuration');
                }

                btn.innerHTML = '<span>⏳</span><span>Testing...</span>';

                // Trigger AI agent with updated config
                try {
                    const triggerResponse = await triggerAIAgentWithConfig(updatedConfig, 'Testing updated instructions');
                    if (triggerResponse.success) {
                        showToast('Instructions updated and tested successfully!', 'success');
                    } else {
                        showToast('Instructions updated but test failed', 'warning');
                    }
                } catch (triggerError) {
                    console.warn('Trigger API error:', triggerError);
                    showToast('Instructions updated but test failed', 'warning');
                }

                document.getElementById('customInstructions').value = '';
                switchPage('chat');
            } catch (error) {
                showToast(error.message || 'Failed to update instructions', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>✓</span><span>Update Instructions</span>';
            }
        }

        // ==================== CONFIG HANDLERS ====================
        async function loadConfig() {
            try {
                const response = await getAgentConfig();
                if (response.success && response.data) {
                    const llmConfig = response.data.agent_workflow?.agents?.[0]?.llm;
                    if (llmConfig) {
                        const modelType = llmConfig.model_type || 'openai';
                        
                        if (modelType === 'openai_style') {
                            const variant = response.data.openai_style || 'gaudi';
                            document.getElementById('modelType').value = `openai_style_${variant}`;
                        } else {
                            document.getElementById('modelType').value = modelType;
                        }

                        updateModelNameField(modelType);
                        document.getElementById('modelName').value = llmConfig.model_name || 'gpt-4o';
                        document.getElementById('apiKey').value = llmConfig.api_key || '';
                        document.getElementById('apiUrl').value = llmConfig.api_url || '';
                        document.getElementById('temperature').value = llmConfig.temperature || 0;
                        document.getElementById('tempValue').textContent = llmConfig.temperature || 0;

                        updateApiUrlVisibility();
                    }
                }
            } catch (error) {
                showToast('Failed to load configuration', 'error');
            }
        }

        function updateModelNameField(modelType) {
            const modelNameSelect = document.getElementById('modelName');
            
            if (modelType === 'openai') {
                modelNameSelect.innerHTML = `
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                `;
            } else {
                // For openai_style, convert to text input
                const currentValue = modelNameSelect.value;
                const parent = modelNameSelect.parentElement;
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.id = 'modelName';
                newInput.className = 'input';
                newInput.placeholder = 'Enter model name';
                newInput.value = currentValue;
                parent.replaceChild(newInput, modelNameSelect);
            }
        }

        function updateApiUrlVisibility() {
            const modelType = document.getElementById('modelType').value;
            const apiUrlGroup = document.getElementById('apiUrlGroup');
            
            if (modelType.startsWith('openai_style')) {
                apiUrlGroup.style.display = 'block';
            } else {
                apiUrlGroup.style.display = 'none';
            }
        }

        async function handleSaveConfig() {
            const modelTypeValue = document.getElementById('modelType').value;
            const apiKey = document.getElementById('apiKey').value.trim();

            if (!apiKey) {
                showToast('Please enter an API key', 'error');
                return;
            }

            const btn = document.getElementById('saveConfig');
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span><span>Saving...</span>';

            try {
                const configResponse = await getAgentConfig();
                if (!configResponse.success) {
                    throw new Error('Failed to get current configuration');
                }

                let modelType, openaiStyleVariant;
                if (modelTypeValue.startsWith('openai_style')) {
                    modelType = 'openai_style';
                    openaiStyleVariant = modelTypeValue.split('_')[2]; // gaudi or amd
                } else {
                    modelType = modelTypeValue;
                }

                const modelName = document.getElementById('modelName').value;
                const apiUrl = document.getElementById('apiUrl').value;
                const temperature = parseFloat(document.getElementById('temperature').value);

                const currentAgent = configResponse.data.agent_workflow?.agents?.[0];

                // Clear retriever tool arrays
                let updatedTools = { ...currentAgent.tools };
                if (updatedTools["1"] && updatedTools["1"].name === "retriever") {
                    updatedTools["1"] = {
                        ...updatedTools["1"],
                        files_path: [],
                        file_id: []
                    };
                }

                const updatedConfig = {
                    ...configResponse.data,
                    ...(modelType === 'openai_style' ? { openai_style: openaiStyleVariant } : {}),
                    agent_workflow: {
                        ...configResponse.data.agent_workflow,
                        agents: {
                            ...configResponse.data.agent_workflow.agents,
                            "0": {
                                ...currentAgent,
                                llm: {
                                    model_type: modelType,
                                    model_name: modelName,
                                    api_key: apiKey,
                                    temperature: temperature,
                                    ...(modelType === 'openai_style' && apiUrl ? { api_url: apiUrl } : {})
                                },
                                tools: updatedTools
                            }
                        }
                    }
                };

                const updateResponse = await updateAgentConfig(updatedConfig);
                if (!updateResponse.success) {
                    throw new Error('Failed to save configuration');
                }

                btn.innerHTML = '<span>⏳</span><span>Testing...</span>';

                // Trigger AI agent with updated config
                try {
                    const triggerResponse = await triggerAIAgentWithConfig(updatedConfig, 'Testing configuration');
                    if (triggerResponse.success) {
                        showToast('Configuration saved and tested successfully!', 'success');
                    } else {
                        showToast('Configuration saved but test failed', 'warning');
                    }
                } catch (triggerError) {
                    console.warn('Trigger API error:', triggerError);
                    showToast('Configuration saved but test failed', 'warning');
                }

                switchPage('chat');
            } catch (error) {
                showToast(error.message || 'Failed to save configuration', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>✓</span><span>Save Configuration</span>';
            }
        }

        // ==================== DATA LOADING ====================
        async function loadPapers() {
            try {
                const response = await getAllPapers();
                if (response.success && response.data) {
                    state.papers = response.data;
                    renderPapersList();
                }
            } catch (error) {
                console.error('Error loading papers:', error);
            }
        }

        // ==================== EVENT LISTENERS ====================
        function initEventListeners() {
            // Theme toggle
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);

            // Header Navigation
            document.querySelectorAll('.header-nav').forEach(item => {
                item.addEventListener('click', () => {
                    switchPage(item.dataset.page);
                });
            });

            // New Chat and Follow-up Toggle
            document.getElementById('newChatBtn').addEventListener('click', handleNewChat);
            document.getElementById('followUpToggle').addEventListener('click', handleFollowUpToggle);

            // Chat
            document.getElementById('sendBtn').addEventListener('click', handleSendMessage);
            document.getElementById('chatInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });

            // Upload
            const uploadZone = document.getElementById('uploadZone');
            const fileInput = document.getElementById('fileInput');

            uploadZone.addEventListener('click', () => fileInput.click());
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
                    handleFileSelect(file);
                } else {
                    showToast('Please select a PDF or TXT file', 'error');
                }
            });

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            document.getElementById('removeFile').addEventListener('click', handleRemoveFile);
            document.getElementById('uploadBtn').addEventListener('click', handleUpload);

            // Instructions
            document.getElementById('cancelInstructions').addEventListener('click', () => {
                switchPage('chat');
            });
            document.getElementById('updateInstructions').addEventListener('click', handleUpdateInstructions);

            // Config
            document.getElementById('modelType').addEventListener('change', (e) => {
                const value = e.target.value;
                let modelType = value;
                
                if (value.startsWith('openai_style')) {
                    modelType = 'openai_style';
                }
                
                updateModelNameField(modelType);
                updateApiUrlVisibility();
            });

            document.getElementById('temperature').addEventListener('input', (e) => {
                document.getElementById('tempValue').textContent = e.target.value;
            });

            document.getElementById('cancelConfig').addEventListener('click', () => {
                switchPage('chat');
            });
            document.getElementById('saveConfig').addEventListener('click', handleSaveConfig);

            // Modal
            document.getElementById('closeModal').addEventListener('click', () => {
                document.getElementById('fileModal').classList.remove('active');
            });

            document.getElementById('fileModal').addEventListener('click', (e) => {
                if (e.target.id === 'fileModal') {
                    document.getElementById('fileModal').classList.remove('active');
                }
            });
        }

        // ==================== INITIALIZATION ====================
        async function init() {
            initTheme();
            initEventListeners();
            
            // Initialize thread ID
            state.currentThreadId = generateThreadId();
            
            await loadPapers();
            await loadChatHistory();
            
            // Initialize AI agent (warm start)
            await initializeAIAgent();
            
            // Hide initialization overlay after everything is loaded
            const overlay = document.getElementById('initOverlay');
            overlay.classList.add('hidden');
            
            // Remove overlay from DOM after transition completes
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
            
            console.log('AI Research Assistant initialized');
        }

        // Start the application
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>
