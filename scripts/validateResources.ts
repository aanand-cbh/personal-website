import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

// Define the schema for a link
const LinkSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
});

// Define the schema for a subcategory
const SubcategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  links: z.array(LinkSchema).min(1),
});

// Define the schema for a category
const CategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  subcategories: z.array(SubcategorySchema).min(1),
});

// Define the schema for the entire resources.json file
const ResourcesSchema = z.object({
  categories: z.array(CategorySchema).min(1),
});

try {
  // Read the resources.json file
  const resourcesPath = path.join(process.cwd(), 'data', 'resources_bookmark_valid.json');
  const resourcesContent = fs.readFileSync(resourcesPath, 'utf-8');
  const resourcesData = JSON.parse(resourcesContent);

  // Validate the data
  ResourcesSchema.parse(resourcesData);
  
  console.log('✅ Resources validation successful!');
  process.exit(0);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error('❌ Resources validation failed:');
    error.errors.forEach((err: z.ZodIssue) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('❌ Error reading or parsing resources.json:', error);
  }
  process.exit(1);
} 