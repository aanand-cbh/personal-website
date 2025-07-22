const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), "content/blog");

// Function to validate an MDX file
function validateMdxFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content } = matter(fileContents);
    
    // Check for required frontmatter fields
    const requiredFields = ['title', 'date', 'description'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error(`Error in ${filePath}: Missing required frontmatter fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Check for unclosed code blocks (count of backticks should be even)
    const backtickMatches = content.match(/```/g);
    if (backtickMatches && backtickMatches.length % 2 !== 0) {
      console.error(`Error in ${filePath}: Unclosed code block detected (uneven number of code fences)`);
      return false;
    }
    
    // Check for stray backticks at the end of file
    if (content.trim().endsWith('```')) {
      console.error(`Error in ${filePath}: File ends with backticks which may indicate an unclosed code block`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Get all MDX files from category directories
function getAllMdxFiles() {
  const allFiles = [];
  
  try {
    // Get all category directories
    const categories = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Get files from each category directory
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
        .map(file => path.join(categoryPath, file));
      
      allFiles.push(...files);
    }
    
    return allFiles;
  } catch (error) {
    console.error('Error reading MDX files:', error);
    return [];
  }
}

// Validate all MDX files
function validateAllMdxFiles() {
  const files = getAllMdxFiles();
  let hasErrors = false;
  
  files.forEach(file => {
    console.log(`Validating ${file}...`);
    if (!validateMdxFile(file)) {
      hasErrors = true;
    }
  });
  
  if (hasErrors) {
    console.error('MDX validation failed. Please fix the above errors before building.');
    process.exit(1);
  } else {
    console.log('All MDX files validated successfully!');
  }
}

// Run validation
validateAllMdxFiles(); 