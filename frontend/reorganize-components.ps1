# Script to reorganize components and views

$components = @(
	"ElementsSidebar",
	"TemplateCanvas",
	"HeadingProperties",
	"TextProperties",
	"ButtonProperties",
	"ImageProperties"
)

$views = @(
	"BuilderView",
	"TemplatesView"
)

Write-Host "Reorganizing components and views..." -ForegroundColor Green

# Process each component
foreach ($component in $components) {
	$source = "frontend/src/components/$component.vue"
	$destFolder = "frontend/src/components/$component"
	$destVue = "$destFolder/$component.vue"
	$destCss = "$destFolder/$component.css"
	$destIndex = "$destFolder/index.ts"

	if (Test-Path $source) {
		Write-Host "Processing $component..." -ForegroundColor Yellow

		# Read the Vue file
		$content = Get-Content $source -Raw

		# Extract styles (between <style scoped> and </style>)
		if ($content -match '(?s)<style scoped>(.*?)</style>') {
			$styles = $matches[1].Trim()

			# Remove style section from Vue content
			$vueContent = $content -replace '(?s)<style scoped>.*?</style>', ''

			# Add CSS import to script section
			$vueContent = $vueContent -replace '(<script setup lang="ts">)', "`$1`nimport './$component.css';"

			# Save Vue file
			$vueContent | Out-File -FilePath $destVue -Encoding utf8

			# Save CSS file
			$styles | Out-File -FilePath $destCss -Encoding utf8

			# Create index.ts
			"export { default } from './$component.vue';" | Out-File -FilePath $destIndex -Encoding utf8

			Write-Host "  ✓ Created $destVue" -ForegroundColor Green
			Write-Host "  ✓ Created $destCss" -ForegroundColor Green
			Write-Host "  ✓ Created $destIndex" -ForegroundColor Green
		}
	}
}

# Process each view
foreach ($view in $views) {
	$source = "frontend/src/views/$view.vue"
	$destFolder = "frontend/src/views/$view"
	$destVue = "$destFolder/$view.vue"
	$destCss = "$destFolder/$view.css"
	$destIndex = "$destFolder/index.ts"

	if (Test-Path $source) {
		Write-Host "Processing $view..." -ForegroundColor Yellow

		# Read the Vue file
		$content = Get-Content $source -Raw

		# Extract styles (between <style scoped> and </style>)
		if ($content -match '(?s)<style scoped>(.*?)</style>') {
			$styles = $matches[1].Trim()

			# Remove style section from Vue content
			$vueContent = $content -replace '(?s)<style scoped>.*?</style>', ''

			# Add CSS import to script section
			$vueContent = $vueContent -replace '(<script setup lang="ts">)', "`$1`nimport './$view.css';"

			# Save Vue file
			$vueContent | Out-File -FilePath $destVue -Encoding utf8

			# Save CSS file
			$styles | Out-File -FilePath $destCss -Encoding utf8

			# Create index.ts
			"export { default } from './$view.vue';" | Out-File -FilePath $destIndex -Encoding utf8

			Write-Host "  ✓ Created $destVue" -ForegroundColor Green
			Write-Host "  ✓ Created $destCss" -ForegroundColor Green
			Write-Host "  ✓ Created $destIndex" -ForegroundColor Green
		}
	}
}

Write-Host "`nReorganization complete!" -ForegroundColor Green
