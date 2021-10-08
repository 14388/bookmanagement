<!DOCTYPE html>
<html lang="en" style="display:table; margin: auto;">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rich Text Editor in JS</title>
    <script src="https://kit.fontawesome.com/4b13903f75.js" crossorigin="anonymous"></script>
</head>
<body onLoad="enableEditMode();" style="display: table-cell; vertical-align: middle; padding-top: 20px;">
<div id="title"></div>
<div>
    <button onclick = "execCmd('bold');"><i class="fas fa-bold "></i></button>
    <button onclick = "execCmd('italic');"><i class="fas fa-italic "></i></button>
    <button onclick = "execCmd('underline');"><i class="fas fa-underline "></i></button>
    <button onclick = "execCmd('justifyLeft');"><i class="fas fa-align-left "></i></button>
    <button onclick = "execCmd('justifyCenter');"><i class="fas fa-align-center "></i></button>
    <button onclick = "execCmd('justifyRight');"><i class="fas fa-align-right "></i></button>
    <button onclick = "execCmd('justifyFull');"><i class="fas fa-align-justify "></i></button>
    Font:
    <select onclick = "execCommandWithArg('fontName', this.value);">
        <option value="Arial">Arial</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Courier">Courier</option>
        <option value="Georgia">Georgia</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
    </select>
    Font Size:
    <select onclick = "execCommandWithArg('fontSize', this.value);">
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
    </select>
    Fore Color: <input type="color" onchange="execCommandWithArg('foreColor', this.value);">
    Background: <input type="color" onchange="execCommandWithArg('hiliteColor', this.value);">
</div>
<iframe name = "richTextField" style="width:1500px; height:500px;"></iframe><br/>
<button type="button" id="save-content-btn">Submit</button>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="editor.script.js"></script>
</body>
</html>