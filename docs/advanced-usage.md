# Advanced Usage

Advanced features and workflows for PCA Papyrus mathematical content generation.

## Dual JSON PDF Generation ⭐ **NEW**

### Advanced Dual PDF Workflows

The dual JSON system enables sophisticated content creation patterns for educational and professional use.

#### Educational Assessment Workflows

```javascript
// Exam version management
class ExamVersionManager {
    constructor() {
        this.manager = window.dualJSONManager;
    }
    
    // Create Version A and Version B simultaneously
    createExamVersions(baseQuestions, alternateQuestions) {
        // Switch to PDF #1 for Version A
        this.manager.switchToJSON(1);
        document.getElementById('json-input').value = JSON.stringify(baseQuestions, null, 2);
        
        // Switch to PDF #2 for Version B
        this.manager.switchToJSON(2);
        document.getElementById('json-input').value = JSON.stringify(alternateQuestions, null, 2);
        
        // Generate both versions
        this.manager.generateAllPreviews();
        
        return {
            versionA: this.manager.jsonSets[1],
            versionB: this.manager.jsonSets[2]
        };
    }
    
    // Print both versions with proper separation
    printBothVersions() {
        this.manager.printBothPDFs();
    }
}
```

#### Content Comparison Workflows

```javascript
// Compare different content approaches
function compareContentVersions(originalContent, revisedContent) {
    const dualManager = window.dualJSONManager;
    
    // Load original version in PDF #1
    dualManager.switchToJSON(1);
    document.getElementById('json-input').value = JSON.stringify(originalContent, null, 2);
    
    // Load revised version in PDF #2
    dualManager.switchToJSON(2);
    document.getElementById('json-input').value = JSON.stringify(revisedContent, null, 2);
    
    // Generate both for side-by-side review
    dualManager.generateAllPreviews();
    
    // Switch between versions for comparison
    console.log('Switch between PDF #1 and PDF #2 tabs to compare versions');
}
```

#### Template Development Patterns

```javascript
// Develop templates with variations
class TemplateWorkflow {
    constructor() {
        this.dualManager = window.dualJSONManager;
    }
    
    // Create template and example simultaneously
    developTemplate(templateStructure, exampleContent) {
        // PDF #1: Template structure
        this.dualManager.switchToJSON(1);
        this.loadContent(templateStructure);
        
        // PDF #2: Filled example
        this.dualManager.switchToJSON(2);
        this.loadContent(exampleContent);
        
        this.dualManager.generateAllPreviews();
    }
    
    // Create problem set and answer key
    createProblemAndAnswers(problems, solutions) {
        this.dualManager.switchToJSON(1);
        this.loadContent(problems);
        
        this.dualManager.switchToJSON(2);
        this.loadContent(solutions);
        
        this.dualManager.generateAllPreviews();
    }
    
    loadContent(content) {
        document.getElementById('json-input').value = JSON.stringify(content, null, 2);
        this.dualManager.saveCurrentContent();
    }
}
```

### Dual JSON Configuration Strategies

#### Shared Settings Management

```javascript
// Configure settings that apply to both PDFs
function configureSharedSettings() {
    // Margin configuration (applies to both PDFs)
    document.getElementById('margin-top').value = 15;
    document.getElementById('margin-right').value = 10;
    document.getElementById('margin-bottom').value = 15;
    document.getElementById('margin-left').value = 10;
    
    // Font configuration (applies to both PDFs)
    document.getElementById('font-h1').value = 28;
    document.getElementById('font-h2').value = 24;
    document.getElementById('font-body').value = 12;
    
    // Trigger updates
    window.updateMarginsFromForm();
    window.updateFontSizesFromForm();
    
    // Debug mode for development
    document.getElementById('debug-mode').checked = true;
    
    // Page numbers for professional output
    document.getElementById('show-page-numbers').checked = true;
}
```

#### Independent Content Processing

```javascript
// Each PDF processes independently
function demonstrateIndependentProcessing() {
    const manager = window.dualJSONManager;
    
    // PDF #1: Header repeats on every page
    const content1 = [
        {
            "id": "header-1",
            "html": "<div>Math Exam - Version A</div>",
            "isPapyrusHeader": true  // Will repeat on each page of PDF #1
        },
        {
            "id": "content-1",
            "html": "<div>Questions for Version A...</div>"
        }
    ];
    
    // PDF #2: Different header structure
    const content2 = [
        {
            "id": "header-2", 
            "html": "<div>Math Exam - Version B</div>",
            "isPapyrusHeader": true  // Will repeat on each page of PDF #2
        },
        {
            "id": "content-2",
            "html": "<div>Questions for Version B...</div>"
        }
    ];
    
    // Load and process independently
    manager.switchToJSON(1);
    document.getElementById('json-input').value = JSON.stringify(content1, null, 2);
    
    manager.switchToJSON(2);
    document.getElementById('json-input').value = JSON.stringify(content2, null, 2);
    
    // Each PDF will have its own header repetition and page splitting
    manager.generateAllPreviews();
}
```

### Use Case Examples

#### Language Learning Materials

```javascript
// Create bilingual materials
function createBilingualWorksheets(englishContent, spanishContent) {
    const manager = window.dualJSONManager;
    
    // English version in PDF #1
    manager.switchToJSON(1);
    document.getElementById('json-input').value = JSON.stringify(englishContent, null, 2);
    
    // Spanish version in PDF #2
    manager.switchToJSON(2); 
    document.getElementById('json-input').value = JSON.stringify(spanishContent, null, 2);
    
    manager.generateAllPreviews();
    
    // Print both for distribution
    manager.printBothPDFs();
}
```

#### Differentiated Instruction

```javascript
// Create materials for different skill levels
function createDifferentiatedMaterials(basicLevel, advancedLevel) {
    const manager = window.dualJSONManager;
    
    // Basic level in PDF #1
    manager.switchToJSON(1);
    document.getElementById('json-input').value = JSON.stringify(basicLevel, null, 2);
    
    // Advanced level in PDF #2
    manager.switchToJSON(2);
    document.getElementById('json-input').value = JSON.stringify(advancedLevel, null, 2);
    
    manager.generateAllPreviews();
}
```

## Programmatic 4-PDF Generation ⭐ **NEW**

### Enterprise-Grade Automated Workflows

The programmatic 4-PDF generator represents the pinnacle of automated mathematical content generation, designed for educational institutions, content management platforms, and enterprise applications requiring high-volume PDF processing.

#### Educational Institution Integration

```javascript
// Enterprise math curriculum generator
class CurriculumGenerator {
    constructor() {
        this.mathDomains = ['algebra', 'geometry', 'calculus', 'statistics'];
        this.institutionConfig = {
            margins: { top: 20, right: 15, bottom: 20, left: 15 },
            fonts: { h1: 24, h2: 20, h3: 18, body: 11 },
            branding: true,
            pageNumbers: true
        };
    }
    
    // Generate complete semester materials
    async generateSemesterMaterials(semesterConfig) {
        // Apply institutional formatting standards
        this.applyInstitutionStandards();
        
        // Batch generate all mathematical domains
        const results = await this.batchGenerateAllDomains();
        
        // Archive and distribute
        await this.archiveAndDistribute(results);
        
        return {
            status: 'success',
            semesterCode: semesterConfig.code,
            materialsGenerated: 4,
            totalPages: results.totalPages,
            distributionChannels: ['lms', 'print', 'digital']
        };
    }
    
    applyInstitutionStandards() {
        // Configure for university standards
        setMargins(this.institutionConfig.margins);
        setFontSizes(this.institutionConfig.fonts);
        setShowPageNumbers(this.institutionConfig.pageNumbers);
        
        console.log('✅ Applied institutional formatting standards');
    }
    
    async batchGenerateAllDomains() {
        let totalPages = 0;
        const domainResults = {};
        
        // Generate each mathematical domain
        for (const domain of this.mathDomains) {
            const result = await this.generateDomainPDF(domain);
            domainResults[domain] = result;
            totalPages += result.pageCount;
            
            console.log(`📚 Generated ${domain}: ${result.pageCount} pages`);
        }
        
        return { domainResults, totalPages };
    }
    
    async generateDomainPDF(domain) {
        // Simulate domain-specific generation
        const startTime = performance.now();
        
        // Use programmatic generator
        await window.generateAndPrintAll();
        
        const duration = performance.now() - startTime;
        
        return {
            domain,
            pageCount: Math.floor(Math.random() * 4) + 2, // 2-5 pages
            generationTime: duration,
            quality: 'institutional-grade'
        };
    }
}
```

#### Content Management Platform Integration

```javascript
// Advanced content pipeline for educational platforms
class MathContentPipeline {
    constructor(apiConfig) {
        this.apiEndpoint = apiConfig.endpoint;
        this.authToken = apiConfig.token;
        this.batchConfig = {
            maxConcurrentJobs: 3,
            retryAttempts: 2,
            outputFormats: ['pdf', 'html', 'archive']
        };
    }
    
    // Process content batches for multiple classes
    async processBatchContent(contentRequests) {
        const results = [];
        
        for (const request of contentRequests) {
            try {
                const result = await this.processContentRequest(request);
                results.push(result);
                
                // Notify progress to external systems
                await this.notifyProgress(request.id, 'completed', result);
                
            } catch (error) {
                console.error(`❌ Failed to process ${request.id}:`, error);
                await this.notifyProgress(request.id, 'failed', { error: error.message });
            }
        }
        
        return results;
    }
    
    async processContentRequest(request) {
        // Configure for specific request parameters
        this.configureForRequest(request);
        
        // Generate mathematical content
        const generationResult = await this.generateMathContent(request.topics);
        
        // Post-process and format
        const formattedResult = await this.postProcessContent(generationResult);
        
        return {
            requestId: request.id,
            classCode: request.classCode,
            topics: request.topics,
            pagesGenerated: formattedResult.pageCount,
            outputUrls: formattedResult.urls,
            metadata: formattedResult.metadata
        };
    }
    
    configureForRequest(request) {
        // Dynamic configuration based on request
        const config = {
            margins: request.formatting?.margins || { top: 15, right: 10, bottom: 15, left: 10 },
            fonts: request.formatting?.fonts || { h1: 28, h2: 24, body: 12 },
            pageNumbers: request.options?.pageNumbers ?? true,
            debugMode: request.options?.debug ?? false
        };
        
        setMargins(config.margins);
        setFontSizes(config.fonts);
        setShowPageNumbers(config.pageNumbers);
        
        if (config.debugMode) {
            document.getElementById('debug-mode').checked = true;
        }
    }
    
    async generateMathContent(topics) {
        const startTime = performance.now();
        
        // Use programmatic 4-PDF generator
        await window.generateAndPrintAll();
        
        const duration = performance.now() - startTime;
        
        return {
            topics,
            generationTime: duration,
            status: 'success'
        };
    }
    
    async postProcessContent(generationResult) {
        // Archive generated content
        const archiveUrl = await this.archiveContent(generationResult);
        
        // Generate metadata
        const metadata = {
            generatedAt: new Date().toISOString(),
            generationTime: generationResult.generationTime,
            mathEngine: 'KaTeX',
            pdfEngine: 'PCA-Papyrus',
            version: '0.1.0'
        };
        
        return {
            pageCount: 4, // Fixed for 4-PDF generator
            urls: {
                pdf: `${archiveUrl}/combined.pdf`,
                html: `${archiveUrl}/preview.html`,
                archive: archiveUrl
            },
            metadata
        };
    }
}
```

#### Performance Optimization Strategies

```javascript
// High-performance batch processing optimizations
class PerformanceOptimizer {
    constructor() {
        this.cache = new Map();
        this.metrics = {
            avgGenerationTime: 0,
            peakMemoryUsage: 0,
            successRate: 100
        };
    }
    
    // Optimized batch generation with caching
    async optimizedBatchGeneration(requests) {
        // Pre-warm caches
        await this.preWarmMathEngine();
        
        // Optimize memory usage
        this.optimizeMemoryFootprint();
        
        // Process with performance monitoring
        const results = await this.processWithMonitoring(requests);
        
        // Cleanup and report
        this.cleanup();
        this.reportMetrics();
        
        return results;
    }
    
    async preWarmMathEngine() {
        // Pre-render common mathematical expressions
        const commonExpressions = [
            '$x^2 + y^2 = z^2$',
            '$\\frac{d}{dx}[f(x)]$',
            '$\\int_a^b f(x) dx$',
            '$\\sum_{i=1}^n x_i$'
        ];
        
        for (const expr of commonExpressions) {
            if (window.katex) {
                window.katex.render(expr, document.createElement('div'));
            }
        }
        
        console.log('🔥 Math engine pre-warmed with common expressions');
    }
    
    optimizeMemoryFootprint() {
        // Configure for minimal memory usage
        const optimization = {
            reuseContainers: true,
            lazyImageLoading: true,
            minimalDOMNodes: true
        };
        
        // Apply optimizations
        this.configureOptimizations(optimization);
        
        console.log('⚡ Memory optimizations applied');
    }
    
    async processWithMonitoring(requests) {
        const results = [];
        const startMemory = performance.memory?.usedJSHeapSize || 0;
        
        for (let i = 0; i < requests.length; i++) {
            const startTime = performance.now();
            
            // Generate with monitoring
            const result = await this.monitoredGeneration(requests[i]);
            
            const endTime = performance.now();
            const currentMemory = performance.memory?.usedJSHeapSize || 0;
            
            // Update metrics
            this.updateMetrics(endTime - startTime, currentMemory - startMemory);
            
            results.push(result);
            
            // Log progress
            console.log(`📊 Processed ${i + 1}/${requests.length}: ${(endTime - startTime).toFixed(2)}ms`);
        }
        
        return results;
    }
    
    async monitoredGeneration(request) {
        try {
            // Execute programmatic generation
            await window.generateAndPrintAll();
            
            return {
                status: 'success',
                requestId: request.id,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error(`❌ Generation failed for ${request.id}:`, error);
            
            return {
                status: 'error',
                requestId: request.id,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    updateMetrics(generationTime, memoryDelta) {
        // Update running averages
        this.metrics.avgGenerationTime = 
            (this.metrics.avgGenerationTime + generationTime) / 2;
        
        this.metrics.peakMemoryUsage = 
            Math.max(this.metrics.peakMemoryUsage, memoryDelta);
    }
    
    reportMetrics() {
        console.log('📈 Performance Metrics:');
        console.log(`   Average Generation Time: ${this.metrics.avgGenerationTime.toFixed(2)}ms`);
        console.log(`   Peak Memory Usage: ${(this.metrics.peakMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
        console.log(`   Success Rate: ${this.metrics.successRate}%`);
    }
}
```

### Production Deployment Patterns

#### Kubernetes Deployment

```yaml
# k8s-deployment.yaml for programmatic PDF generation
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pca-papyrus-generator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pca-papyrus
  template:
    metadata:
      labels:
        app: pca-papyrus
    spec:
      containers:
      - name: pdf-generator
        image: pca-papyrus:latest
        ports:
        - containerPort: 8004
        env:
        - name: NODE_ENV
          value: "production"
        - name: BATCH_SIZE
          value: "4"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

#### Docker Integration

```dockerfile
# Production Dockerfile for programmatic generation
FROM node:18-alpine

WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install --production

# Configure for batch processing
ENV PAPYRUS_MODE=programmatic
ENV BATCH_CONCURRENT_LIMIT=4
ENV MEMORY_LIMIT=1024

# Expose application port
EXPOSE 8004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8004/health || exit 1

# Start application
CMD ["python3", "serve.py"]
```

## Multi-JSON PDF Generation

### Batch Processing Workflows

PCA Papyrus supports sophisticated multi-JSON workflows for large-scale document generation.

#### Educational Institution Setup

```javascript
// Configure for exam generation
const examGenerator = {
    margins: { top: 15, right: 10, bottom: 15, left: 10 },
    fonts: { h1: 28, h2: 24, body: 12 },
    sources: [
        "exam-version-a.json",
        "exam-version-b.json", 
        "exam-version-c.json",
        "exam-version-d.json"
    ]
};

// Load multiple exam versions
examGenerator.sources.forEach((source, index) => {
    loadJSONSource(source, index + 1);
});

// Generate all with unified formatting
generateAllPreviews();

// Print with proper page separation
printAllPDFs();
```

#### Assessment Platform Integration

```javascript
// Dynamic JSON generation from templates
function generatePersonalizedQuizzes(studentData) {
    const quizzes = studentData.map(student => ({
        id: `quiz-${student.id}`,
        content: generateQuizJSON(student.level, student.topics),
        name: `Quiz for ${student.name}`
    }));
    
    // Load into multi-JSON interface
    quizzes.forEach((quiz, index) => {
        if (index > 0) window.addNewJSON();
        window.switchToJSON(index + 1);
        setJSONContent(quiz.content);
    });
    
    // Batch process
    window.generateAllPreviews();
}
```

#### Automated Workflows

```javascript
// Programmatic interface for automation
class AutomatedPDFGenerator {
    constructor(jsonSources) {
        this.jsonSources = jsonSources;
        this.initialize();
    }
    
    initialize() {
        // Load all JSON sources
        this.jsonSources.forEach((source, index) => {
            this.loadJSONToTab(source, index + 1);
        });
    }
    
    generateAndPrint() {
        // No preview - direct to print
        window.generateAllPreviews();
        setTimeout(() => {
            window.printAllPDFs();
        }, 2000); // Wait for generation
    }
}

// Usage for production workflows
const generator = new AutomatedPDFGenerator([
    mathExamA, mathExamB, mathExamC, mathExamD
]);
generator.generateAndPrint();
```

### Multi-JSON Configuration Patterns

#### Shared Settings Strategy

```javascript
// Configure once, apply to all
const sharedConfig = {
    margins: { top: 10, right: 8, bottom: 10, left: 8 },
    fonts: { h1: 32, h2: 28, h3: 24, body: 14 },
    spacing: 4,
    pageNumbers: true,
    debugMode: false
};

// Apply to all JSON sources
applySharedConfiguration(sharedConfig);
```

#### Content Validation Patterns

```javascript
// Validate all JSON sources before processing
function validateAllJSONSources() {
    const allJSONs = window.multiJSONManager.getAllJSONContents();
    
    return allJSONs.every(jsonSet => {
        try {
            const parsed = JSON.parse(jsonSet.content);
            return Array.isArray(parsed) && parsed.length > 0;
        } catch (error) {
            console.error(`Invalid JSON in ${jsonSet.name}:`, error);
            return false;
        }
    });
}

// Generate only if all sources are valid
if (validateAllJSONSources()) {
    window.generateAllPreviews();
} else {
    alert('Please fix invalid JSON sources before generating.');
}
```

## Advanced Single JSON Features

Advanced features and techniques for PCA Papyrus mathematical content generation.

## Repeating Headers

Create headers that appear on every page using the `isPapyrusHeader` property:

### Student Information Header

```json
{
  "id": "student-header",
  "html": "<table style='width: 100%; border-collapse: collapse; border: 1px solid #333;'><tr><td style='border: 1px solid #333; padding: 8px; width: 40%;'><strong>Name:</strong> _________________________</td><td style='border: 1px solid #333; padding: 8px; width: 30%;'><strong>Class:</strong> ____________</td><td style='border: 1px solid #333; padding: 8px; width: 30%;'><strong>Date:</strong> ____________</td></tr></table>",
  "isPapyrusHeader": true,
  "classes": ["font-mono"],
  "style": "margin-bottom: 15mm;"
}
```

### Exam Header with Institution

```json
{
  "id": "exam-header",
  "html": "<div style='text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px;'><h2 style='margin: 0; font-size: 18px;'>MATHEMATICS DEPARTMENT</h2><h3 style='margin: 5px 0; font-size: 16px;'>Final Examination - Calculus I</h3><p style='margin: 5px 0; font-size: 12px;'>Duration: 3 hours | Total Points: 100</p></div>",
  "isPapyrusHeader": true,
  "style": "margin-bottom: 20mm;"
}
```

## Complex Mathematical Content

### Multi-line Equations

```json
{
  "id": "system-equations",
  "html": "<div><strong>Problem 3:</strong> Solve the system:<br/>$$\\begin{cases}2x + 3y - z = 7 \\\\ x - 2y + 4z = 3 \\\\ 3x + y + 2z = 1\\end{cases}$$</div>",
  "style": "margin: 15px 0;"
}
```

### Derivative Tables

```json
{
  "id": "derivative-table",
  "html": "<table style='width: 100%; border-collapse: collapse; margin: 10px 0;'><thead><tr style='background: #f5f5f5;'><th style='border: 1px solid #ddd; padding: 8px;'>Function</th><th style='border: 1px solid #ddd; padding: 8px;'>Derivative</th></tr></thead><tbody><tr><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f(x) = x^n$</td><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f'(x) = nx^{n-1}$</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f(x) = \\sin(x)$</td><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f'(x) = \\cos(x)$</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f(x) = e^x$</td><td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>$f'(x) = e^x$</td></tr></tbody></table>"
}
```

### Integral with Steps

```json
{
  "id": "integration-steps",
  "html": "<div><strong>Example:</strong> Evaluate $\\int x^2 \\sin(x) dx$ using integration by parts.<br/><br/><strong>Solution:</strong><br/>Let $u = x^2$ and $dv = \\sin(x) dx$<br/>Then $du = 2x dx$ and $v = -\\cos(x)$<br/><br/>$$\\int x^2 \\sin(x) dx = -x^2\\cos(x) + \\int 2x\\cos(x) dx$$<br/><br/>Apply integration by parts again...</div>",
  "style": "background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;"
}
```

## Advanced Styling Techniques

### Custom CSS Classes

Add custom styling through the classes array:

```json
{
  "id": "highlighted-theorem",
  "html": "<div><strong>Theorem 1:</strong> If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists $c \\in (a,b)$ such that $$f'(c) = \\frac{f(b) - f(a)}{b - a}$$</div>",
  "classes": ["theorem-box"],
  "style": "background: #fff3cd; border: 2px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;"
}
```

### Step-by-Step Solutions

```json
{
  "id": "solution-steps",
  "html": "<div><strong>Solution:</strong><br/><ol style='margin-left: 20px;'><li><strong>Step 1:</strong> Factor the denominator<br/>$x^2 - 4 = (x-2)(x+2)$</li><li><strong>Step 2:</strong> Use partial fractions<br/>$\\frac{1}{x^2-4} = \\frac{A}{x-2} + \\frac{B}{x+2}$</li><li><strong>Step 3:</strong> Solve for A and B<br/>$1 = A(x+2) + B(x-2)$</li></ol></div>",
  "style": "margin: 15px 0; padding: 10px; background: #f0f8ff; border-radius: 5px;"
}
```

### Answer Boxes

```json
{
  "id": "answer-section",
  "html": "<div style='border: 2px solid #333; padding: 20px; margin-top: 30px;'><strong>Answer:</strong><br/><br/>$x = $ _______________<br/><br/>$y = $ _______________<br/><br/><strong>Work:</strong><br/><br/><div style='height: 100px; border: 1px dashed #ccc; margin-top: 10px;'></div></div>"
}
```

## Layout and Spacing Control

### Section Dividers

```json
{
  "id": "section-divider",
  "html": "<hr style='border: none; height: 2px; background: linear-gradient(to right, #333, #ccc, #333); margin: 30px 0;'/>"
}
```

### Column Layouts

```json
{
  "id": "two-column-problems",
  "html": "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;'><div style='padding: 15px; border: 1px solid #ddd;'><strong>Problem A:</strong><br/>Differentiate $f(x) = x^3 + 2x^2 - 5x + 1$</div><div style='padding: 15px; border: 1px solid #ddd;'><strong>Problem B:</strong><br/>Integrate $\\int (3x^2 - 4x + 7) dx$</div></div>"
}
```

### Page Break Control

```json
{
  "id": "page-break-marker",
  "html": "<div style='page-break-before: always; visibility: hidden; height: 1px;'></div>"
}
```

## Typography and Mathematical Notation

### Mixed Text and Math

```json
{
  "id": "mixed-content",
  "html": "<div>The function $f(x) = \\sqrt{x^2 + 1}$ has domain $\\mathbb{R}$ and range $[1, \\infty)$. Its derivative is $f'(x) = \\frac{x}{\\sqrt{x^2 + 1}}$, which shows that $f$ is increasing on $(0, \\infty)$ and decreasing on $(-\\infty, 0)$.</div>",
  "style": "line-height: 1.6; margin: 15px 0;"
}
```

### Mathematical Sets and Symbols

```json
{
  "id": "sets-symbols",
  "html": "<div><strong>Notation Review:</strong><br/>$\\mathbb{N}$ = Natural numbers<br/>$\\mathbb{Z}$ = Integers<br/>$\\mathbb{Q}$ = Rational numbers<br/>$\\mathbb{R}$ = Real numbers<br/>$\\mathbb{C}$ = Complex numbers<br/>$\\emptyset$ = Empty set<br/>$\\infty$ = Infinity</div>",
  "style": "background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;"
}
```

### Limit Notation

```json
{
  "id": "limit-examples",
  "html": "<div><strong>Limit Examples:</strong><br/><br/>1) $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$<br/><br/>2) $\\lim_{x \\to \\infty} \\frac{1}{x} = 0$<br/><br/>3) $\\lim_{x \\to 2^+} \\frac{1}{x-2} = +\\infty$</div>",
  "style": "margin: 20px 0;"
}
```

## Advanced Configuration

### Custom Font Scaling

```javascript
// Programmatically adjust fonts for different content types
import { setFontSizes } from './src/core/font-config.js';

// Large format for presentations
setFontSizes({
  h1: 42, h2: 36, h3: 30, h4: 26, h5: 22, h6: 20, body: 18
});

// Compact format for homework sheets
setFontSizes({
  h1: 28, h2: 24, h3: 20, h4: 18, h5: 16, h6: 14, body: 12
});
```

### Dynamic Margin Adjustment

```javascript
// Adjust margins based on content density
import { setMargins, setSpaceBetweenDivs } from './src/core/margin-config.js';

// Compact layout for more content
setMargins({ top: 3, right: 3, bottom: 3, left: 3 });
setSpaceBetweenDivs(2);

// Spacious layout for readability  
setMargins({ top: 8, right: 6, bottom: 8, left: 6 });
setSpaceBetweenDivs(5);
```

## Content Templates

### Quiz Template

```json
[
  {
    "id": "quiz-header",
    "html": "<div style='text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px;'><h1 style='margin: 0; font-size: 24px;'>WEEKLY QUIZ #5</h1><h2 style='margin: 10px 0; font-size: 18px;'>Derivatives and Applications</h2><p style='margin: 5px 0;'>Name: _________________ Date: _________ Score: ___/20</p></div>",
    "isPapyrusHeader": true,
    "style": "margin-bottom: 25mm;"
  },
  {
    "id": "instructions",
    "html": "<div style='background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 20px;'><strong>Instructions:</strong> Show all work. Partial credit will be given for correct setup and method.</div>"
  },
  {
    "id": "problem-1",
    "html": "<div><strong>1. (5 points)</strong> Find the derivative of $f(x) = 3x^4 - 2x^3 + 7x - 1$<br/><br/><strong>Answer:</strong> $f'(x) = $ _______________________</div>",
    "style": "margin-bottom: 30px;"
  }
]
```

### Homework Template

```json
[
  {
    "id": "homework-header",
    "html": "<table style='width: 100%; border-collapse: collapse;'><tr><td style='width: 70%; padding: 10px; border: 1px solid #000;'><strong>Name:</strong> _________________________<br/><strong>Course:</strong> Calculus I, Section 02</td><td style='width: 30%; padding: 10px; border: 1px solid #000; text-align: center;'><strong>Homework #7</strong><br/>Due: Friday, Oct 15</td></tr></table>",
    "isPapyrusHeader": true,
    "style": "margin-bottom: 20mm;"
  },
  {
    "id": "chapter-title",
    "html": "<h2 style='text-align: center; color: #2c3e50; border-bottom: 1px solid #3498db; padding-bottom: 10px;'>Chapter 3: Applications of Derivatives</h2>",
    "style": "margin-bottom: 20px;"
  }
]
```

## Debugging and Optimization

### Debug Mode Usage

Enable debug mode to see element boundaries and measurements:

```javascript
// Enable debug mode programmatically
document.getElementById('debug-mode').checked = true;
window.papyrusDebugMode = true;
generatePages();

// Debug mode shows:
// - Element borders in different colors
// - Height measurements for each element
// - Page break indicators
// - Content overflow warnings
```

### Performance Tips

```javascript
// Limit content size for large worksheets
const MAX_PROBLEMS = 30;
if (jsonData.length > MAX_PROBLEMS) {
  console.warn('Large content detected, consider splitting into multiple sheets');
}

// Use efficient math notation
// Good: $x^2 + y^2 = r^2$
// Avoid: Complex nested structures that slow rendering

// Optimize images and tables
// Use CSS instead of inline styles where possible
// Minimize deeply nested HTML structures
```

### Content Validation

```javascript
// Validate mathematical notation
function validateMathContent(html) {
  const mathRegex = /\$.*?\$/g;
  const matches = html.match(mathRegex);
  
  if (matches) {
    return matches.every(match => {
      // Check for balanced braces, proper escaping, etc.
      const content = match.slice(1, -1);
      return validateKaTeX(content);
    });
  }
  
  return true;
}

// Check content length for page limits
function checkContentLength(jsonData) {
  const estimatedHeight = jsonData.length * 15; // Rough estimate
  if (estimatedHeight > 1000) { // A4 height in mm ≈ 297mm content area
    console.warn('Content may exceed 4-page limit');
  }
}
```

## Custom CSS Integration

### External Stylesheets

Add custom CSS classes in your content:

```css
/* Add to your custom CSS */
.theorem-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.solution-steps {
  counter-reset: step-counter;
}

.solution-steps .step {
  counter-increment: step-counter;
  margin: 10px 0;
  padding-left: 30px;
  position: relative;
}

.solution-steps .step::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: #007bff;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
```

### Print-Specific Styling

```css
@media print {
  .no-print {
    display: none !important;
  }
  
  .page-break-before {
    page-break-before: always;
  }
  
  .keep-together {
    page-break-inside: avoid;
  }
  
  /* Ensure math formulas print clearly */
  .katex {
    font-size: 1.1em !important;
  }
  
  /* Optimize table printing */
  table {
    page-break-inside: avoid;
  }
}
``` 