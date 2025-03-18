const fs = require('fs');
const path = require('path');

// 处理指定目录下的所有HTML文件
function processHtmlFiles(directory) {
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 确定相对路径
        const relativePath = path.relative(directory, path.join(__dirname, '..', 'styles'));
        const styleLink = path.join(relativePath, 'custom.css').replace(/\\/g, '/');
        
        // 检查是否已经包含custom.css
        if (!content.includes('custom.css')) {
            // 在head标签中添加custom.css引用
            content = content.replace(
                /<\/head>/i,
                `    <link rel="stylesheet" href="${styleLink}">\n    </head>`
            );
            
            // 写回文件
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`${file} already contains custom.css`);
        }
    });
}

// 处理根目录
const rootDir = path.join(__dirname, '..');
processHtmlFiles(rootDir);

// 处理pages目录
const pagesDir = path.join(rootDir, 'pages');
processHtmlFiles(pagesDir); 