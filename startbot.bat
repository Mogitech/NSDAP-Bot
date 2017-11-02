echo off
IF EXIST %cd%\Resources\ffmpeg set PATH=%PATH%;%cd%\Resources\ffmpeg\bin
node bot.js
pause