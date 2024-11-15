document.addEventListener('DOMContentLoaded',function(){const hoverGrid = document.querySelector('.hover-grid');
    console.log("running");
    // Function to assign specific messages to VS Code icons and areas
    function getTooltipMessage(row, col) {
        // File Button (1:2)
        if (row === 1 && col === 2) {
            return "File Menu: The File menu allows you to open, save, and manage files and projects. You can create new files, open existing ones, and close the workspace. This is where you go to manage your files.";
        }
        // Edit Button (1:3)
        if (row === 1 && col === 3) {
            return "Edit Menu: The Edit menu contains common text-editing commands like Undo, Redo, Cut, Copy, and Paste. It's also where you'll find options for selecting, finding, and replacing text.";
        }
        // Selection Button (1:4)
        if (row === 1 && col === 4) {
            return "Selection Menu: The Selection menu helps you with text selection, such as selecting the next occurrence of text or expanding the selection to include more lines.";
        }
        // View Button (1:5)
        if (row === 1 && col === 5) {
            return "View Menu: The View menu lets you toggle the visibility of different parts of the editor, like the Explorer, Extensions, Terminal, and more. You can customize the layout of your workspace.";
        }
        // Go Button (1:6)
        if (row === 1 && col === 6) {
            return "Go Menu: The Go menu helps you navigate your code by jumping to specific files, functions, or symbols. Use it to quickly move between files and lines of code.";
        }
        // Run Button (1:7)
        if (row === 1 && col === 7) {
            return "Run Menu: The Run menu allows you to start, stop, and debug your application. You can configure different run and debug settings for your projects.";
        }
        // Terminal Button (1:8)
        if (row === 1 && col === 8) {
            return "Terminal Menu: The Terminal menu lets you open, close, and manage terminal windows in VS Code. It's where you'll execute your code or run scripts from the command line.";
        }
        // Help Button (1:10)
        if (row === 1 && col === 10) {
            return "Help Menu: The Help menu provides access to VS Code's documentation, support, and release notes. You can check for updates and learn more about the editor here.";
        }
        // Search Bar (1:17 - 1:27)
        if (row === 1 && col >= 17 && col <= 27) {
            return "Search Bar: The search bar allows you to quickly find files or text within your workspace. Type a keyword or filename to search, and you'll see matching results across your project.";
        }
        // Toggle Primary Side Bar (1:35)
        if (row === 1 && col === 35) {
            return "Toggle Primary Side Bar: This button toggles the visibility of the main sidebar (Explorer, Search, etc.) on the left side of the editor.";
        }
        // Toggle Secondary Side Bar (1:36)
        if (row === 1 && col === 36) {
            return "Toggle Secondary Side Bar: This button toggles the secondary sidebar, allowing you to access additional panels like the Extensions menu.";
        }
        // Minimize Button (1:38)
        if (row === 1 && col === 38) {
            return "Minimize Window: This button minimizes the VS Code window. Use it to hide the editor while keeping it running in the background.";
        }
        // Full-Screen Button (1:39)
        if (row === 1 && col === 39) {
            return "Full-Screen Button: This button maximizes the VS Code window to fill your screen. Useful for focusing on coding without distractions.";
        }
        // Exit Full-Screen Button (1:40)
        if (row === 1 && col === 40) {
            return "Exit Full-Screen Button: Click this button to exit full-screen mode and return to the normal window size.";
        }
        // Split Editor Button (2:40)
        if (row === 2 && col === 40) {
            return "Split Editor Button: This button splits the editor into multiple views, allowing you to view and work on multiple files side by side.";
        }
        // File Explorer Icon (2:1)
        if (row === 2 && col === 1) {
            return "File Explorer Icon: Click this to view the Explorer, where you can manage your project's files and folders.";
        }
        // Search Icon (4:1)
        if (row === 4 && col === 1) {
            return "Search Icon: Click this to search for text across all files in your project. You can also use the search bar at the top of the editor.";
        }
        // Source Control Icon (6:1)
        if (row === 6 && col === 1) {
            return "Source Control Icon: Click this to access version control tools like Git. Here you can commit, push, and pull code to your repository.";
        }
        // Run and Debug Icon (8:1)
        if (row === 8 && col === 1) {
            return "Run and Debug Icon: Click this to run or debug your code. You can set breakpoints and step through your code to troubleshoot issues.";
        }
        // Extensions Icon (10:1)
        if (row === 10 && col === 1) {
            return "Extensions Icon: Click this to browse and install extensions to add new functionality to VS Code.";
        }
        // Main Folder (3:2 - 3:5)
        if (row === 3 && col >= 2 && col <= 5) {
            return "Explorer: This is where you can see what folder you have open and all of the content inside. This folder is currently open and contains all your project's files. You can expand or collapse folders by clicking the arrows next to their names.";
        }
        // User Created Folder (Closed) (4:3)
        if (row === 4 && col === 3) {
            return "User-Created Folder (Closed): This folder is currently collapsed. Click the arrow next to it to expand and view the files inside.";
        }
        // User Created Folder (Open) (5:3)
        if (row === 5 && col === 3) {
            return "User-Created Folder (Open): This folder is open and displays its contents. Click the arrow next to the folder name to collapse it.";
        }
        // User-Created HTML File (Selected) (6:3)
        if (row === 6 && col === 3) {
            return "User-Created HTML File (Selected): This HTML file is selected and open in the editor. You can edit its contents here.";
        }
        // User-Created Folder (Closed) (6:4)
        if (row === 6 && col === 4) {
            return "User-Created Folder (Closed): This folder is currently collapsed. Click the arrow to expand it and view the files inside.";
        }
        //Opened Tab
        if (col >= 6 && col <= 8 && row >= 2) {
            return "Current File: This is the name and extension of the current file we are editing. You can have multiple files open at once and click on whice one you want to open and edit easily.";
        }
        // x or circle for saved or not
        if (col === 9 && row === 2){
            return "Clicking on the X will close the file. You can easily reopen it in the file explorer to the left. If there is a white circle here instead of the X the code editor is telling you that you have unsaved changes to your file. To save go file->save or CTRL+S"
        } 
        // Editor Area (Columns 5-16, Rows 1-12)
        if (col >= 6 && col <= 39 && row >= 4 && row <= 32) {
            return "Editor Area: This is the main workspace where you write your code. Each tab at the top represents an open file. You can switch between files by clicking the tabs. As you write code, pay attention to syntax highlighting and auto-complete suggestions, which make coding easier.";
        }
        // Terminal/Debug Console Area (Columns 5-16, Rows 14-20)
        if (col >= 6 && col <= 38 && row >= 33 && row <= 38) {
            return "Terminal/Debug Console Area: This is where you can run your code in the terminal or view debug information about your running code. It displays output and error messages to help you troubleshoot issues.";
        }
        if(col === 1 && row === 39) {
            return "Settings: Clicking this icon will pop up different setting options."
        }
        // Caution and Warning Signals (40:2 - 40:4)
    if (row === 40 && col >= 2 && col <= 4) {
    return "Caution/Warning Signals: These icons indicate issues in your workspace, such as errors or warnings in your code. Clicking them opens the Problems panel, where you can view and fix any issues. It's important to pay attention to these indicators as they help ensure your code is error-free.";
    }
    
    // Outline Tab (38:2)
    if (row === 38 && col === 2) {
    return "Outline Tab: The Outline tab shows a structured view of the symbols in your file, like functions and variables. It helps you navigate large files more easily by letting you jump to specific parts of your code.";
    }
    
    // Timeline Tab (39:2)
    if (row === 39 && col === 2) {
    return "Timeline Tab: The Timeline tab shows the version history of your file, including changes made over time. You can use it to review previous edits and track how your file has evolved.";
    }
        // Bottom Row Icons (General for Row 40)
        if (row === 40 && col >= 5) {
            return "Bottom Row Icons: These icons provide quick access to various VS Code features, such as managing Git branches, opening extensions, or adjusting settings.";
        }
    
        return null; // No tooltip for other areas
    }
    
    // Dynamically generate hover areas for a 40x40 grid (smaller squares)
    for (let row = 1; row <= 40; row++) {
        for (let col = 1; col <= 40; col++) {
            const hoverArea = document.createElement('div');
            hoverArea.classList.add('hover-area');
    
       
    
            const message = getTooltipMessage(row, col);
            
            // Only create a tooltip if there is a message
            if (message) {
                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.textContent = message;
                hoverArea.appendChild(tooltip);
            }
            
            hoverGrid.appendChild(hoverArea);
        }
    }})
