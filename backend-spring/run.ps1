# run.ps1 — Lance le backend Spring Boot (Plants Module API)
# Usage: .\run.ps1

$JAVA = "C:\Program Files\Java\jdk-21\bin\java.exe"
$WRAPPER_JAR = "$PSScriptRoot\.mvn\wrapper\maven-wrapper.jar"
& $JAVA "-Dmaven.multiModuleProjectDirectory=$PSScriptRoot" -classpath $WRAPPER_JAR org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
