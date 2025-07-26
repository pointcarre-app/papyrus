# Technical Summary

This document provides a technical overview of the PCA Papyrus application, a JavaScript-based tool for generating and previewing multi-page documents from structured JSON data.

## `/src` Directory Architecture

The `/src` directory contains all the application logic, organized into a modular architecture with clear separation of concerns.

### Overall Module Structure

```mermaid
graph TB
    subgraph "Entry Point"
        INDEX["`**index.js**
        Application Bootstrap`"]
    end
    
    subgraph "Core Modules"
        APPINIT["`**app-init.js**
        Application Initialization
        Event Handling`"]
        
        CONTENTMODEL["`**content-model.js**
        Data Model
        Page Calculations`"]
        
        PRINTMGR["`**print-manager.js**
        Print Functionality
        PDF Generation`"]
        
        DOCMGR["`**document-manager.js**
        Multi-Document Management`"]
    end
    
    subgraph "Configuration Modules"
        MARGINCONF["`**margin-config.js**
        Page Layout Settings`"]
        
        FONTCONF["`**font-config.js**
        Typography Settings`"]
        
        PAGENUMCONF["`**page-number-config.js**
        Page Numbering Settings`"]
    end
    
    subgraph "Preview Module"
        PREVINDEX["`**preview/index.js**
        Preview Orchestration`"]
        
        PREVCALC["`**preview/calculator.js**
        Page Break Logic`"]
        
        PREVRENDER["`**preview/renderer.js**
        HTML Generation`"]
        
        PREVUTILS["`**preview/utils.js**
        Helper Functions`"]
        
        PREVTYPES["`**preview/types.js**
        Type Definitions`"]
    end
    
    subgraph "Statistics Module"
        STATINDEX["`**statistics/index.js**
        Statistics Interface`"]
        
        STATCALC["`**statistics/calculator.js**
        Metrics Calculation`"]
        
        STATRENDER["`**statistics/renderer.js**
        Statistics Display`"]
        
        STATUTILS["`**statistics/utils.js**
        Data Utilities`"]
        
        STATTYPES["`**statistics/types.js**
        Type Definitions`"]
    end
    
    subgraph "Utilities"
        JSONHANDLER["`**utils/json-handler.js**
        JSON Processing
        Element Creation`"]
    end
    
    subgraph "Styles"
        STYLEDIR["`**styles/**
        CSS Modules
        Theming`"]
    end
    
    INDEX --> APPINIT
    APPINIT --> CONTENTMODEL
    APPINIT --> DOCMGR
    APPINIT --> MARGINCONF
    APPINIT --> FONTCONF
    APPINIT --> PAGENUMCONF
    APPINIT --> PREVINDEX
    
    PREVINDEX --> PREVCALC
    PREVINDEX --> PREVRENDER
    PREVINDEX --> PREVUTILS
    PREVINDEX --> JSONHANDLER
    PREVINDEX --> CONTENTMODEL
    
    CONTENTMODEL --> STATINDEX
    STATINDEX --> STATCALC
    STATINDEX --> STATRENDER
    STATINDEX --> STATUTILS
    
    PRINTMGR --> STYLEDIR
    
    %% Strong, high-contrast colors
    style INDEX fill:#1a365d,stroke:#2c5282,stroke-width:2px,color:#ffffff
    style APPINIT fill:#2d3748,stroke:#4a5568,stroke-width:2px,color:#ffffff
    style CONTENTMODEL fill:#2d3748,stroke:#4a5568,stroke-width:2px,color:#ffffff
    style PRINTMGR fill:#2d3748,stroke:#4a5568,stroke-width:2px,color:#ffffff
    style DOCMGR fill:#2d3748,stroke:#4a5568,stroke-width:2px,color:#ffffff
    style MARGINCONF fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style FONTCONF fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style PAGENUMCONF fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style PREVINDEX fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style PREVCALC fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style PREVRENDER fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style PREVUTILS fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style PREVTYPES fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style STATINDEX fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style STATCALC fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style STATRENDER fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style STATUTILS fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style STATTYPES fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style JSONHANDLER fill:#581c87,stroke:#6b21a8,stroke-width:2px,color:#ffffff
    style STYLEDIR fill:#1e3a8a,stroke:#2563eb,stroke-width:2px,color:#ffffff
```

### Application Initialization Flow

```mermaid
sequenceDiagram
    participant HTML as main.html
    participant INDEX as index.js
    participant APPINIT as app-init.js
    participant DOCMGR as document-manager.js
    participant CONFIG as Config Modules
    participant PREV as Preview Module
    
    HTML->>INDEX: Load Script
    INDEX->>APPINIT: initializeApp()
    
    APPINIT->>CONFIG: Initialize Configurations
    CONFIG-->>APPINIT: Margins, Fonts, Page Numbers
    
    APPINIT->>DOCMGR: Create DocumentManager
    DOCMGR-->>APPINIT: Multi-document Interface
    
    APPINIT->>APPINIT: Setup Event Listeners
    APPINIT->>PREV: Generate Initial Preview
    
    Note over HTML,PREV: Application Ready
```

### Preview Generation Pipeline

```mermaid
flowchart TD
    START([User Input Change]) --> GETJSON[Get JSON from Textarea]
    GETJSON --> VALIDATE{Valid JSON?}
    
    VALIDATE -->|No| ERROR[Show Error State]
    VALIDATE -->|Yes| PARSE[Parse Content Items]
    
    PARSE --> MEASURE[Create Temporary Elements]
    MEASURE --> KATEX[Render KaTeX Math]
    KATEX --> HEIGHTS[Measure Element Heights]
    
    HEIGHTS --> CALC[Calculate Page Breaks]
    CALC --> LAYOUT{Fits on Pages?}
    
    LAYOUT -->|No| WARN[Generate Warnings]
    LAYOUT -->|Yes| RENDER[Render Final Pages]
    
    WARN --> RENDER
    RENDER --> STATS[Update Statistics]
    STATS --> DISPLAY[Display Preview]
    
    DISPLAY --> END([Preview Complete])
    ERROR --> END
    
    %% High contrast colors
    style START fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style END fill:#065f46,stroke:#047857,stroke-width:3px,color:#ffffff
    style ERROR fill:#991b1b,stroke:#dc2626,stroke-width:3px,color:#ffffff
    style WARN fill:#92400e,stroke:#d97706,stroke-width:3px,color:#ffffff
    style VALIDATE fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style LAYOUT fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style GETJSON fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style PARSE fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style MEASURE fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style KATEX fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style HEIGHTS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style CALC fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style RENDER fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style STATS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style DISPLAY fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
```

### Page Break Calculation Algorithm

```mermaid
flowchart TD
    INIT[Initialize: Page 1, Height 0] --> GETHEADER{Has Repeating Header?}
    
    GETHEADER -->|Yes| ADDHEADER[Add Header Height]
    GETHEADER -->|No| NEXTELEMENT
    
    ADDHEADER --> NEXTELEMENT[Get Next Element]
    NEXTELEMENT --> CHECKFIT{Element + Spacing Fits?}
    
    CHECKFIT -->|Yes| ADDELEMENT[Add to Current Page]
    CHECKFIT -->|No| NEWPAGE[Start New Page]
    
    NEWPAGE --> RESETHEIGHT[Reset Height Counter]
    RESETHEIGHT --> ADDHEADER2[Add Header if Exists]
    ADDHEADER2 --> ADDELEMENT
    
    ADDELEMENT --> UPDATEHEIGHT[Update Page Height]
    UPDATEHEIGHT --> MORELEMENTS{More Elements?}
    
    MORELEMENTS -->|Yes| NEXTELEMENT
    MORELEMENTS -->|No| COMPLETE[Page Breaks Complete]
    
    %% High contrast colors
    style INIT fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style COMPLETE fill:#065f46,stroke:#047857,stroke-width:3px,color:#ffffff
    style NEWPAGE fill:#92400e,stroke:#d97706,stroke-width:3px,color:#ffffff
    style GETHEADER fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style CHECKFIT fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style MORELEMENTS fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style ADDHEADER fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style NEXTELEMENT fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style ADDELEMENT fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style RESETHEIGHT fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style ADDHEADER2 fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style UPDATEHEIGHT fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
```

### Statistics Calculation Flow

```mermaid
graph TD
    TRIGGER[Statistics Update Triggered] --> GATHER[Gather Content Data]
    
    GATHER --> SPACING[Calculate Spacing Breakdown]
    GATHER --> HEIGHTS[Calculate Total Heights]
    GATHER --> PAGES[Calculate Page Utilization]
    
    SPACING --> COMBINE[Combine Metrics]
    HEIGHTS --> COMBINE
    PAGES --> COMBINE
    
    COMBINE --> RENDER[Render Statistics HTML]
    RENDER --> OVERVIEW[Generate Overview Section]
    RENDER --> BREAKDOWN[Generate Page Breakdown]
    RENDER --> DETAILED[Generate Detailed Table]
    
    OVERVIEW --> DISPLAY[Update Statistics Display]
    BREAKDOWN --> DISPLAY
    DETAILED --> DISPLAY
    
    %% High contrast colors
    style TRIGGER fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style DISPLAY fill:#065f46,stroke:#047857,stroke-width:3px,color:#ffffff
    style GATHER fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style COMBINE fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style RENDER fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style SPACING fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style HEIGHTS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style PAGES fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style OVERVIEW fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style BREAKDOWN fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style DETAILED fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
```

### Document Management System

```mermaid
stateDiagram-v2
    [*] --> SingleDocument: Initialize
    
    SingleDocument --> MultiDocument: Add Document
    MultiDocument --> MultiDocument: Add/Remove Documents
    MultiDocument --> ActiveDocument: Switch Document
    ActiveDocument --> MultiDocument: Document Operations
    
    state MultiDocument {
        [*] --> TabRendering
        TabRendering --> ContentSync
        ContentSync --> PreviewUpdate
        PreviewUpdate --> [*]
    }
    
    state ActiveDocument {
        [*] --> EditingJSON
        EditingJSON --> AutoSave
        AutoSave --> PreviewRefresh
        PreviewRefresh --> [*]
    }
```

### Print System Architecture

```mermaid
flowchart LR
    USER[User Clicks Print] --> CHOICE{Print All or Active?}
    
    CHOICE -->|Active| ACTIVE[Get Active Document HTML]
    CHOICE -->|All| ALL[Combine All Documents HTML]
    
    ACTIVE --> IFRAME[Create Hidden Iframe]
    ALL --> IFRAME
    
    IFRAME --> STYLES[Inject Print Styles]
    STYLES --> FONTS[Apply Dynamic Fonts]
    FONTS --> KATEX[Render KaTeX Math]
    
    KATEX --> DIALOG[Open Print Dialog]
    DIALOG --> CLEANUP[Clean Up Iframe]
    
    %% High contrast colors
    style USER fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style CLEANUP fill:#065f46,stroke:#047857,stroke-width:3px,color:#ffffff
    style CHOICE fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style ACTIVE fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style ALL fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style IFRAME fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style STYLES fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style FONTS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style KATEX fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style DIALOG fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
```

### Configuration System

```mermaid
graph TB
    subgraph "Configuration Flow"
        UI[UI Form Changes] --> DEBOUNCE[Debounced Update]
        DEBOUNCE --> CONFIG[Update Config State]
        CONFIG --> CSS[Update CSS Variables]
        CSS --> PREVIEW[Regenerate Preview]
        PREVIEW --> STATS[Update Statistics]
    end
    
    subgraph "Margin Configuration"
        MARGIN_UI[Margin Form] --> MARGIN_CONFIG[margin-config.js]
        MARGIN_CONFIG --> MARGIN_CSS[--page-margin-* variables]
    end
    
    subgraph "Font Configuration"
        FONT_UI[Font Form] --> FONT_CONFIG[font-config.js]
        FONT_CONFIG --> FONT_CSS[Font size variables]
    end
    
    subgraph "Page Number Configuration"
        PAGENUM_UI[Page Number Checkbox] --> PAGENUM_CONFIG[page-number-config.js]
        PAGENUM_CONFIG --> PAGENUM_LOGIC[Show/Hide Logic]
    end
    
    UI --> MARGIN_UI
    UI --> FONT_UI
    UI --> PAGENUM_UI
    
    %% High contrast colors
    style UI fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style DEBOUNCE fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style CONFIG fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style CSS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style PREVIEW fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style STATS fill:#065f46,stroke:#047857,stroke-width:2px,color:#ffffff
    style MARGIN_UI fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style MARGIN_CONFIG fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style MARGIN_CSS fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff
    style FONT_UI fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style FONT_CONFIG fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style FONT_CSS fill:#2f855a,stroke:#38a169,stroke-width:2px,color:#ffffff
    style PAGENUM_UI fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style PAGENUM_CONFIG fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
    style PAGENUM_LOGIC fill:#7c2d12,stroke:#9a3412,stroke-width:2px,color:#ffffff
```

### Error Handling and Validation

```mermaid
flowchart TD
    INPUT[User Input] --> VALIDATE[Validate Input]
    
    VALIDATE --> JSON_CHECK{Valid JSON?}
    JSON_CHECK -->|No| JSON_ERROR[Display JSON Error]
    JSON_CHECK -->|Yes| STRUCTURE_CHECK{Valid Structure?}
    
    STRUCTURE_CHECK -->|No| STRUCTURE_ERROR[Use Defaults]
    STRUCTURE_CHECK -->|Yes| SIZE_CHECK{Elements Fit Pages?}
    
    SIZE_CHECK -->|No| SIZE_WARNING[Show Size Warnings]
    SIZE_CHECK -->|Yes| SUCCESS[Process Successfully]
    
    JSON_ERROR --> RECOVERY[Show Recovery Options]
    STRUCTURE_ERROR --> PROCESS[Continue Processing]
    SIZE_WARNING --> PROCESS
    SUCCESS --> PROCESS
    
    PROCESS --> RENDER[Render Output]
    RECOVERY --> INPUT
    
    %% High contrast colors
    style INPUT fill:#1a365d,stroke:#2c5282,stroke-width:3px,color:#ffffff
    style SUCCESS fill:#065f46,stroke:#047857,stroke-width:3px,color:#ffffff
    style JSON_ERROR fill:#991b1b,stroke:#dc2626,stroke-width:3px,color:#ffffff
    style STRUCTURE_ERROR fill:#92400e,stroke:#d97706,stroke-width:3px,color:#ffffff
    style SIZE_WARNING fill:#92400e,stroke:#d97706,stroke-width:3px,color:#ffffff
    style VALIDATE fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style JSON_CHECK fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style STRUCTURE_CHECK fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style SIZE_CHECK fill:#7c2d12,stroke:#ea580c,stroke-width:2px,color:#ffffff
    style RECOVERY fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style PROCESS fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    style RENDER fill:#065f46,stroke:#047857,stroke-width:2px,color:#ffffff
```

## Core Architecture

The application follows a modular, single-page application (SPA) architecture. The core logic is organized into focused modules responsible for distinct parts of the workflow, from data handling to rendering.

-   **`app-init.js`**: The main entry point. It initializes all other modules, sets up global event listeners for UI controls (forms, buttons), and orchestrates the overall application flow.
-   **`content-model.js`**: Defines the central data model for a document's content, managing the array of content items, their properties (like height), and page assignments.
-   **`/preview`**: A dedicated module for generating the live A4 preview.
    -   `index.js`: Orchestrates the preview generation process.
    -   `calculator.js`: Handles the core pagination logic, calculating where page breaks should occur based on element heights.
    -   `renderer.js`: Responsible for rendering the final HTML pages based on the calculated breaks.
    -   `utils.js`: Provides helper functions and constants for the preview module.
-   **`/statistics`**: A module for calculating and displaying content analytics.
    -   `index.js`: The public interface for updating the statistics display.
    -   `calculator.js`: Contains pure functions for calculating metrics like spacing and total height.
    -   `renderer.js`: Generates the HTML for the statistics panel.
-   **`print-manager.js`**: Manages the final print output, creating a print-friendly `<iframe>` with the necessary styles.
-   **Configuration Modules (`margin-config.js`, `font-config.js`, `page-number-config.js`)**: Each module manages a specific aspect of the document's appearance, updating CSS variables and triggering regeneration when changed.
-   **`json-handler.js`**: A utility module for parsing JSON from the UI and creating HTML elements from it.

## Process Flow

1.  **Initialization**:
    -   `app-init.js` runs on page load, setting up all configurations and event listeners.
    -   It prepares the application to respond to user input.

2.  **Live Preview Generation**:
    -   When the user modifies the JSON input or changes a setting, a debounced event triggers the `generatePages` function in the `/preview` module.
    -   **Measurement**: The preview module first creates temporary, off-screen elements to accurately measure their height, including any content rendered by KaTeX.
    -   **Pagination**: The `calculator.js` submodule takes these measurements and calculates where each page break should occur to fit the content within the defined A4 page dimensions and margins.
    -   **Rendering**: The `renderer.js` submodule then generates the final, paginated HTML and displays it in the preview panel.

3.  **Statistics Update**:
    -   After the preview is generated, the system updates the `contentModel` with the new element heights and page assignments.
    -   This data is then passed to the `/statistics` module, which calculates and renders the detailed breakdown of content, spacing, and page utilization.

4.  **Printing**:
    -   When the user clicks a print button, the `print-manager.js` module is invoked.
    -   It takes the HTML content from the current preview, wraps it in print-specific styles, injects it into a hidden `<iframe>`, and triggers the browser's print dialog.

## Visual Workflow

```mermaid
graph TD
    subgraph "User Action"
        A["Edit JSON or Settings"]
    end

    subgraph "Processing Pipeline"
        B["1. Measure Content </br> (preview/utils.js)"]
        C["2. Calculate Page Breaks </br> (preview/calculator.js)"]
        D["3. Render HTML Preview </br> (preview/renderer.js)"]
        E["4. Update Statistics </br> (statistics/index.js)"]
    end

    subgraph "Output"
        F["Live A4 Preview"]
        G["Statistics Panel"]
    end

    A --> B
    B --> C
    C --> D
    D --> F
    D --> E
    E --> G
``` 