
**Contrast NodeDvnr 1.0**: Utility for displaying information about the package.json of the current application.  It creates a report file with the following:

 * Machine Information - OS Version, Processor Speed, Memory Available, Node versions installed
 * Dependency Information - A list of dependencies used by the application from it's package.json


Results are written to terminal, along with a text file in the running directory named "nvnr-{timestamp}.txt" if given write permissions. 

    Install: 
        git clone https://github.com/Contrast-Security-OSS/node-dvnr.git
        npm install -g node-dvnr
    Usage:
        cd <application dir containing package.json> 
        nvnr   
