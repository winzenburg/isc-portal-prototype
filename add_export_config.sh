#!/bin/bash

# List of components and their filenames (excluding clouds and sites which are already done)
declare -A components
components["network-invoices"]="network-invoices"
components["circuit-reports"]="circuit-reports"
components["contacts"]="contacts"
components["application-performance"]="application-performance"
components["circuits"]="circuits"
components["tickets"]="tickets"

for key in "${!components[@]}"; do
  filename="${components[$key]}"
  filepath="src/app/components/pages/${key}-unified/${key}-unified.component.ts"
  
  # Check if file exists
  if [ -f "$filepath" ]; then
    # Check if export config already exists
    if ! grep -q "export:" "$filepath"; then
      echo "Adding export config to ${key}-unified..."
      
      # Add export config before pagination line
      sed -i '' '/pagination: { enabled: true/i\
\
      export: {\
        enabled: true,\
        filename: '"'${filename}'"',\
        buttonLabel: '"'Export CSV'"',\
        showIcon: true,\
        icon: '"'download'"'\
      },\
' "$filepath"
    else
      echo "Export config already exists in ${key}-unified, skipping..."
    fi
  else
    echo "File not found: $filepath"
  fi
done

echo "Done!"
