@echo off
setlocal
set JAVA_HOME=C:\Program Files\Java\jdk-21
set WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar
"%JAVA_HOME%\bin\java.exe" "-Dmaven.multiModuleProjectDirectory=%~dp0" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
