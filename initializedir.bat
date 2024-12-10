# Initialize as a Git repository
git init
git add .
git commit -m "Initial commit"

# Set up the GitHub repository (replace 'philb75' and 'francine-feminine.com')
git remote add origin https://github.com/philb75/francine-feminine.com.git

# Check if the repository exists and erase it if necessary
git push origin --delete main 2>/dev/null || echo "Repository not found, continuing..."

# Push local content to GitHub
git branch -M main
git push -u origin main --force
