#!/bin/bash

# Script automatizado para instalar todas las skills extraídas de skills.sh
# Generado por Manus

echo "Iniciando la instalación masiva de skills..."

echo "Instalando: vercel-react-best-practices desde vercel-labs/agent-skills..."
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
if [ $? -eq 0 ]; then
  echo "✅ vercel-react-best-practices instalado correctamente."
else
  echo "❌ Error al instalar vercel-react-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: web-design-guidelines desde vercel-labs/agent-skills..."
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
if [ $? -eq 0 ]; then
  echo "✅ web-design-guidelines instalado correctamente."
else
  echo "❌ Error al instalar web-design-guidelines."
fi
echo "------------------------------------------"

echo "Instalando: remotion-best-practices desde remotion-dev/skills..."
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
if [ $? -eq 0 ]; then
  echo "✅ remotion-best-practices instalado correctamente."
else
  echo "❌ Error al instalar remotion-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: frontend-design desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill frontend-design
if [ $? -eq 0 ]; then
  echo "✅ frontend-design instalado correctamente."
else
  echo "❌ Error al instalar frontend-design."
fi
echo "------------------------------------------"

echo "Instalando: agent-browser desde vercel-labs/agent-browser..."
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser
if [ $? -eq 0 ]; then
  echo "✅ agent-browser instalado correctamente."
else
  echo "❌ Error al instalar agent-browser."
fi
echo "------------------------------------------"

echo "Instalando: skill-creator desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill skill-creator
if [ $? -eq 0 ]; then
  echo "✅ skill-creator instalado correctamente."
else
  echo "❌ Error al instalar skill-creator."
fi
echo "------------------------------------------"

echo "Instalando: seo-audit desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill seo-audit
if [ $? -eq 0 ]; then
  echo "✅ seo-audit instalado correctamente."
else
  echo "❌ Error al instalar seo-audit."
fi
echo "------------------------------------------"

echo "Instalando: find-skills desde vercel-labs/skills..."
npx skills add https://github.com/vercel-labs/skills --skill find-skills
if [ $? -eq 0 ]; then
  echo "✅ find-skills instalado correctamente."
else
  echo "❌ Error al instalar find-skills."
fi
echo "------------------------------------------"

echo "Instalando: audit-website desde squirrelscan/skills..."
npx skills add https://github.com/squirrelscan/skills --skill audit-website
if [ $? -eq 0 ]; then
  echo "✅ audit-website instalado correctamente."
else
  echo "❌ Error al instalar audit-website."
fi
echo "------------------------------------------"

echo "Instalando: supabase-postgres-best-practices desde supabase/agent-skills..."
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
if [ $? -eq 0 ]; then
  echo "✅ supabase-postgres-best-practices instalado correctamente."
else
  echo "❌ Error al instalar supabase-postgres-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: building-native-ui desde expo/skills..."
npx skills add https://github.com/expo/skills --skill building-native-ui
if [ $? -eq 0 ]; then
  echo "✅ building-native-ui instalado correctamente."
else
  echo "❌ Error al instalar building-native-ui."
fi
echo "------------------------------------------"

echo "Instalando: better-auth-best-practices desde better-auth/skills..."
npx skills add https://github.com/better-auth/skills --skill better-auth-best-practices
if [ $? -eq 0 ]; then
  echo "✅ better-auth-best-practices instalado correctamente."
else
  echo "❌ Error al instalar better-auth-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: copywriting desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill copywriting
if [ $? -eq 0 ]; then
  echo "✅ copywriting instalado correctamente."
else
  echo "❌ Error al instalar copywriting."
fi
echo "------------------------------------------"

echo "Instalando: ui-ux-pro-max desde nextlevelbuilder/ui-ux-pro-max-skill..."
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
if [ $? -eq 0 ]; then
  echo "✅ ui-ux-pro-max instalado correctamente."
else
  echo "❌ Error al instalar ui-ux-pro-max."
fi
echo "------------------------------------------"

echo "Instalando: upgrading-expo desde expo/skills..."
npx skills add https://github.com/expo/skills --skill upgrading-expo
if [ $? -eq 0 ]; then
  echo "✅ upgrading-expo instalado correctamente."
else
  echo "❌ Error al instalar upgrading-expo."
fi
echo "------------------------------------------"

echo "Instalando: marketing-psychology desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill marketing-psychology
if [ $? -eq 0 ]; then
  echo "✅ marketing-psychology instalado correctamente."
else
  echo "❌ Error al instalar marketing-psychology."
fi
echo "------------------------------------------"

echo "Instalando: native-data-fetching desde expo/skills..."
npx skills add https://github.com/expo/skills --skill native-data-fetching
if [ $? -eq 0 ]; then
  echo "✅ native-data-fetching instalado correctamente."
else
  echo "❌ Error al instalar native-data-fetching."
fi
echo "------------------------------------------"

echo "Instalando: pdf desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill pdf
if [ $? -eq 0 ]; then
  echo "✅ pdf instalado correctamente."
else
  echo "❌ Error al instalar pdf."
fi
echo "------------------------------------------"

echo "Instalando: expo-dev-client desde expo/skills..."
npx skills add https://github.com/expo/skills --skill expo-dev-client
if [ $? -eq 0 ]; then
  echo "✅ expo-dev-client instalado correctamente."
else
  echo "❌ Error al instalar expo-dev-client."
fi
echo "------------------------------------------"

echo "Instalando: expo-deployment desde expo/skills..."
npx skills add https://github.com/expo/skills --skill expo-deployment
if [ $? -eq 0 ]; then
  echo "✅ expo-deployment instalado correctamente."
else
  echo "❌ Error al instalar expo-deployment."
fi
echo "------------------------------------------"

echo "Instalando: expo-tailwind-setup desde expo/skills..."
npx skills add https://github.com/expo/skills --skill expo-tailwind-setup
if [ $? -eq 0 ]; then
  echo "✅ expo-tailwind-setup instalado correctamente."
else
  echo "❌ Error al instalar expo-tailwind-setup."
fi
echo "------------------------------------------"

echo "Instalando: expo-api-routes desde expo/skills..."
npx skills add https://github.com/expo/skills --skill expo-api-routes
if [ $? -eq 0 ]; then
  echo "✅ expo-api-routes instalado correctamente."
else
  echo "❌ Error al instalar expo-api-routes."
fi
echo "------------------------------------------"

echo "Instalando: react-native-best-practices desde callstackincubator/agent-skills..."
npx skills add https://github.com/callstackincubator/agent-skills --skill react-native-best-practices
if [ $? -eq 0 ]; then
  echo "✅ react-native-best-practices instalado correctamente."
else
  echo "❌ Error al instalar react-native-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: brainstorming desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill brainstorming
if [ $? -eq 0 ]; then
  echo "✅ brainstorming instalado correctamente."
else
  echo "❌ Error al instalar brainstorming."
fi
echo "------------------------------------------"

echo "Instalando: programmatic-seo desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill programmatic-seo
if [ $? -eq 0 ]; then
  echo "✅ programmatic-seo instalado correctamente."
else
  echo "❌ Error al instalar programmatic-seo."
fi
echo "------------------------------------------"

echo "Instalando: pptx desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill pptx
if [ $? -eq 0 ]; then
  echo "✅ pptx instalado correctamente."
else
  echo "❌ Error al instalar pptx."
fi
echo "------------------------------------------"

echo "Instalando: marketing-ideas desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill marketing-ideas
if [ $? -eq 0 ]; then
  echo "✅ marketing-ideas instalado correctamente."
else
  echo "❌ Error al instalar marketing-ideas."
fi
echo "------------------------------------------"

echo "Instalando: xlsx desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill xlsx
if [ $? -eq 0 ]; then
  echo "✅ xlsx instalado correctamente."
else
  echo "❌ Error al instalar xlsx."
fi
echo "------------------------------------------"

echo "Instalando: expo-cicd-workflows desde expo/skills..."
npx skills add https://github.com/expo/skills --skill expo-cicd-workflows
if [ $? -eq 0 ]; then
  echo "✅ expo-cicd-workflows instalado correctamente."
else
  echo "❌ Error al instalar expo-cicd-workflows."
fi
echo "------------------------------------------"

echo "Instalando: use-dom desde expo/skills..."
npx skills add https://github.com/expo/skills --skill use-dom
if [ $? -eq 0 ]; then
  echo "✅ use-dom instalado correctamente."
else
  echo "❌ Error al instalar use-dom."
fi
echo "------------------------------------------"

echo "Instalando: pricing-strategy desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill pricing-strategy
if [ $? -eq 0 ]; then
  echo "✅ pricing-strategy instalado correctamente."
else
  echo "❌ Error al instalar pricing-strategy."
fi
echo "------------------------------------------"

echo "Instalando: docx desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill docx
if [ $? -eq 0 ]; then
  echo "✅ docx instalado correctamente."
else
  echo "❌ Error al instalar docx."
fi
echo "------------------------------------------"

echo "Instalando: social-content desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill social-content
if [ $? -eq 0 ]; then
  echo "✅ social-content instalado correctamente."
else
  echo "❌ Error al instalar social-content."
fi
echo "------------------------------------------"

echo "Instalando: webapp-testing desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill webapp-testing
if [ $? -eq 0 ]; then
  echo "✅ webapp-testing instalado correctamente."
else
  echo "❌ Error al instalar webapp-testing."
fi
echo "------------------------------------------"

echo "Instalando: copy-editing desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill copy-editing
if [ $? -eq 0 ]; then
  echo "✅ copy-editing instalado correctamente."
else
  echo "❌ Error al instalar copy-editing."
fi
echo "------------------------------------------"

echo "Instalando: vue-best-practices desde hyf0/vue-skills..."
npx skills add https://github.com/hyf0/vue-skills --skill vue-best-practices
if [ $? -eq 0 ]; then
  echo "✅ vue-best-practices instalado correctamente."
else
  echo "❌ Error al instalar vue-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: mcp-builder desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill mcp-builder
if [ $? -eq 0 ]; then
  echo "✅ mcp-builder instalado correctamente."
else
  echo "❌ Error al instalar mcp-builder."
fi
echo "------------------------------------------"

echo "Instalando: launch-strategy desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill launch-strategy
if [ $? -eq 0 ]; then
  echo "✅ launch-strategy instalado correctamente."
else
  echo "❌ Error al instalar launch-strategy."
fi
echo "------------------------------------------"

echo "Instalando: page-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill page-cro
if [ $? -eq 0 ]; then
  echo "✅ page-cro instalado correctamente."
else
  echo "❌ Error al instalar page-cro."
fi
echo "------------------------------------------"

echo "Instalando: onboarding-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill onboarding-cro
if [ $? -eq 0 ]; then
  echo "✅ onboarding-cro instalado correctamente."
else
  echo "❌ Error al instalar onboarding-cro."
fi
echo "------------------------------------------"

echo "Instalando: analytics-tracking desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill analytics-tracking
if [ $? -eq 0 ]; then
  echo "✅ analytics-tracking instalado correctamente."
else
  echo "❌ Error al instalar analytics-tracking."
fi
echo "------------------------------------------"

echo "Instalando: competitor-alternatives desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill competitor-alternatives
if [ $? -eq 0 ]; then
  echo "✅ competitor-alternatives instalado correctamente."
else
  echo "❌ Error al instalar competitor-alternatives."
fi
echo "------------------------------------------"

echo "Instalando: schema-markup desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill schema-markup
if [ $? -eq 0 ]; then
  echo "✅ schema-markup instalado correctamente."
else
  echo "❌ Error al instalar schema-markup."
fi
echo "------------------------------------------"

echo "Instalando: email-sequence desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill email-sequence
if [ $? -eq 0 ]; then
  echo "✅ email-sequence instalado correctamente."
else
  echo "❌ Error al instalar email-sequence."
fi
echo "------------------------------------------"

echo "Instalando: paid-ads desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill paid-ads
if [ $? -eq 0 ]; then
  echo "✅ paid-ads instalado correctamente."
else
  echo "❌ Error al instalar paid-ads."
fi
echo "------------------------------------------"

echo "Instalando: canvas-design desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill canvas-design
if [ $? -eq 0 ]; then
  echo "✅ canvas-design instalado correctamente."
else
  echo "❌ Error al instalar canvas-design."
fi
echo "------------------------------------------"

echo "Instalando: signup-flow-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill signup-flow-cro
if [ $? -eq 0 ]; then
  echo "✅ signup-flow-cro instalado correctamente."
else
  echo "❌ Error al instalar signup-flow-cro."
fi
echo "------------------------------------------"

echo "Instalando: free-tool-strategy desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill free-tool-strategy
if [ $? -eq 0 ]; then
  echo "✅ free-tool-strategy instalado correctamente."
else
  echo "❌ Error al instalar free-tool-strategy."
fi
echo "------------------------------------------"

echo "Instalando: systematic-debugging desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill systematic-debugging
if [ $? -eq 0 ]; then
  echo "✅ systematic-debugging instalado correctamente."
else
  echo "❌ Error al instalar systematic-debugging."
fi
echo "------------------------------------------"

echo "Instalando: paywall-upgrade-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill paywall-upgrade-cro
if [ $? -eq 0 ]; then
  echo "✅ paywall-upgrade-cro instalado correctamente."
else
  echo "❌ Error al instalar paywall-upgrade-cro."
fi
echo "------------------------------------------"

echo "Instalando: form-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill form-cro
if [ $? -eq 0 ]; then
  echo "✅ form-cro instalado correctamente."
else
  echo "❌ Error al instalar form-cro."
fi
echo "------------------------------------------"

echo "Instalando: referral-program desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill referral-program
if [ $? -eq 0 ]; then
  echo "✅ referral-program instalado correctamente."
else
  echo "❌ Error al instalar referral-program."
fi
echo "------------------------------------------"

echo "Instalando: popup-cro desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill popup-cro
if [ $? -eq 0 ]; then
  echo "✅ popup-cro instalado correctamente."
else
  echo "❌ Error al instalar popup-cro."
fi
echo "------------------------------------------"

echo "Instalando: ab-test-setup desde coreyhaines31/marketingskills..."
npx skills add https://github.com/coreyhaines31/marketingskills --skill ab-test-setup
if [ $? -eq 0 ]; then
  echo "✅ ab-test-setup instalado correctamente."
else
  echo "❌ Error al instalar ab-test-setup."
fi
echo "------------------------------------------"

echo "Instalando: test-driven-development desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill test-driven-development
if [ $? -eq 0 ]; then
  echo "✅ test-driven-development instalado correctamente."
else
  echo "❌ Error al instalar test-driven-development."
fi
echo "------------------------------------------"

echo "Instalando: create-auth-skill desde better-auth/skills..."
npx skills add https://github.com/better-auth/skills --skill create-auth-skill
if [ $? -eq 0 ]; then
  echo "✅ create-auth-skill instalado correctamente."
else
  echo "❌ Error al instalar create-auth-skill."
fi
echo "------------------------------------------"

echo "Instalando: doc-coauthoring desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill doc-coauthoring
if [ $? -eq 0 ]; then
  echo "✅ doc-coauthoring instalado correctamente."
else
  echo "❌ Error al instalar doc-coauthoring."
fi
echo "------------------------------------------"

echo "Instalando: agent-md-refactor desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill agent-md-refactor
if [ $? -eq 0 ]; then
  echo "✅ agent-md-refactor instalado correctamente."
else
  echo "❌ Error al instalar agent-md-refactor."
fi
echo "------------------------------------------"

echo "Instalando: daily-meeting-update desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill daily-meeting-update
if [ $? -eq 0 ]; then
  echo "✅ daily-meeting-update instalado correctamente."
else
  echo "❌ Error al instalar daily-meeting-update."
fi
echo "------------------------------------------"

echo "Instalando: commit-work desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill commit-work
if [ $? -eq 0 ]; then
  echo "✅ commit-work instalado correctamente."
else
  echo "❌ Error al instalar commit-work."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-slide-deck desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-slide-deck
if [ $? -eq 0 ]; then
  echo "✅ baoyu-slide-deck instalado correctamente."
else
  echo "❌ Error al instalar baoyu-slide-deck."
fi
echo "------------------------------------------"

echo "Instalando: session-handoff desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill session-handoff
if [ $? -eq 0 ]; then
  echo "✅ session-handoff instalado correctamente."
else
  echo "❌ Error al instalar session-handoff."
fi
echo "------------------------------------------"

echo "Instalando: codex desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill codex
if [ $? -eq 0 ]; then
  echo "✅ codex instalado correctamente."
else
  echo "❌ Error al instalar codex."
fi
echo "------------------------------------------"

echo "Instalando: theme-factory desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill theme-factory
if [ $? -eq 0 ]; then
  echo "✅ theme-factory instalado correctamente."
else
  echo "❌ Error al instalar theme-factory."
fi
echo "------------------------------------------"

echo "Instalando: qa-test-planner desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill qa-test-planner
if [ $? -eq 0 ]; then
  echo "✅ qa-test-planner instalado correctamente."
else
  echo "❌ Error al instalar qa-test-planner."
fi
echo "------------------------------------------"

echo "Instalando: gemini desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill gemini
if [ $? -eq 0 ]; then
  echo "✅ gemini instalado correctamente."
else
  echo "❌ Error al instalar gemini."
fi
echo "------------------------------------------"

echo "Instalando: meme-factory desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill meme-factory
if [ $? -eq 0 ]; then
  echo "✅ meme-factory instalado correctamente."
else
  echo "❌ Error al instalar meme-factory."
fi
echo "------------------------------------------"

echo "Instalando: dependency-updater desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill dependency-updater
if [ $? -eq 0 ]; then
  echo "✅ dependency-updater instalado correctamente."
else
  echo "❌ Error al instalar dependency-updater."
fi
echo "------------------------------------------"

echo "Instalando: domain-name-brainstormer desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill domain-name-brainstormer
if [ $? -eq 0 ]; then
  echo "✅ domain-name-brainstormer instalado correctamente."
else
  echo "❌ Error al instalar domain-name-brainstormer."
fi
echo "------------------------------------------"

echo "Instalando: ship-learn-next desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill ship-learn-next
if [ $? -eq 0 ]; then
  echo "✅ ship-learn-next instalado correctamente."
else
  echo "❌ Error al instalar ship-learn-next."
fi
echo "------------------------------------------"

echo "Instalando: mermaid-diagrams desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill mermaid-diagrams
if [ $? -eq 0 ]; then
  echo "✅ mermaid-diagrams instalado correctamente."
else
  echo "❌ Error al instalar mermaid-diagrams."
fi
echo "------------------------------------------"

echo "Instalando: gepetto desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill gepetto
if [ $? -eq 0 ]; then
  echo "✅ gepetto instalado correctamente."
else
  echo "❌ Error al instalar gepetto."
fi
echo "------------------------------------------"

echo "Instalando: writing-clearly-and-concisely desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill writing-clearly-and-concisely
if [ $? -eq 0 ]; then
  echo "✅ writing-clearly-and-concisely instalado correctamente."
else
  echo "❌ Error al instalar writing-clearly-and-concisely."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-article-illustrator desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-article-illustrator
if [ $? -eq 0 ]; then
  echo "✅ baoyu-article-illustrator instalado correctamente."
else
  echo "❌ Error al instalar baoyu-article-illustrator."
fi
echo "------------------------------------------"

echo "Instalando: crafting-effective-readmes desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill crafting-effective-readmes
if [ $? -eq 0 ]; then
  echo "✅ crafting-effective-readmes instalado correctamente."
else
  echo "❌ Error al instalar crafting-effective-readmes."
fi
echo "------------------------------------------"

echo "Instalando: skill-judge desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill skill-judge
if [ $? -eq 0 ]; then
  echo "✅ skill-judge instalado correctamente."
else
  echo "❌ Error al instalar skill-judge."
fi
echo "------------------------------------------"

echo "Instalando: reducing-entropy desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill reducing-entropy
if [ $? -eq 0 ]; then
  echo "✅ reducing-entropy instalado correctamente."
else
  echo "❌ Error al instalar reducing-entropy."
fi
echo "------------------------------------------"

echo "Instalando: marp-slide desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill marp-slide
if [ $? -eq 0 ]; then
  echo "✅ marp-slide instalado correctamente."
else
  echo "❌ Error al instalar marp-slide."
fi
echo "------------------------------------------"

echo "Instalando: command-creator desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill command-creator
if [ $? -eq 0 ]; then
  echo "✅ command-creator instalado correctamente."
else
  echo "❌ Error al instalar command-creator."
fi
echo "------------------------------------------"

echo "Instalando: difficult-workplace-conversations desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill difficult-workplace-conversations
if [ $? -eq 0 ]; then
  echo "✅ difficult-workplace-conversations instalado correctamente."
else
  echo "❌ Error al instalar difficult-workplace-conversations."
fi
echo "------------------------------------------"

echo "Instalando: professional-communication desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill professional-communication
if [ $? -eq 0 ]; then
  echo "✅ professional-communication instalado correctamente."
else
  echo "❌ Error al instalar professional-communication."
fi
echo "------------------------------------------"

echo "Instalando: feedback-mastery desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill feedback-mastery
if [ $? -eq 0 ]; then
  echo "✅ feedback-mastery instalado correctamente."
else
  echo "❌ Error al instalar feedback-mastery."
fi
echo "------------------------------------------"

echo "Instalando: browser-use desde browser-use/browser-use..."
npx skills add https://github.com/browser-use/browser-use --skill browser-use
if [ $? -eq 0 ]; then
  echo "✅ browser-use instalado correctamente."
else
  echo "❌ Error al instalar browser-use."
fi
echo "------------------------------------------"

echo "Instalando: plugin-forge desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill plugin-forge
if [ $? -eq 0 ]; then
  echo "✅ plugin-forge instalado correctamente."
else
  echo "❌ Error al instalar plugin-forge."
fi
echo "------------------------------------------"

echo "Instalando: web-artifacts-builder desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill web-artifacts-builder
if [ $? -eq 0 ]; then
  echo "✅ web-artifacts-builder instalado correctamente."
else
  echo "❌ Error al instalar web-artifacts-builder."
fi
echo "------------------------------------------"

echo "Instalando: writing-plans desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill writing-plans
if [ $? -eq 0 ]; then
  echo "✅ writing-plans instalado correctamente."
else
  echo "❌ Error al instalar writing-plans."
fi
echo "------------------------------------------"

echo "Instalando: c4-architecture desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill c4-architecture
if [ $? -eq 0 ]; then
  echo "✅ c4-architecture instalado correctamente."
else
  echo "❌ Error al instalar c4-architecture."
fi
echo "------------------------------------------"

echo "Instalando: humanizer desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill humanizer
if [ $? -eq 0 ]; then
  echo "✅ humanizer instalado correctamente."
else
  echo "❌ Error al instalar humanizer."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-cover-image desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-cover-image
if [ $? -eq 0 ]; then
  echo "✅ baoyu-cover-image instalado correctamente."
else
  echo "❌ Error al instalar baoyu-cover-image."
fi
echo "------------------------------------------"

echo "Instalando: algorithmic-art desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill algorithmic-art
if [ $? -eq 0 ]; then
  echo "✅ algorithmic-art instalado correctamente."
else
  echo "❌ Error al instalar algorithmic-art."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-xhs-images desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-xhs-images
if [ $? -eq 0 ]; then
  echo "✅ baoyu-xhs-images instalado correctamente."
else
  echo "❌ Error al instalar baoyu-xhs-images."
fi
echo "------------------------------------------"

echo "Instalando: executing-plans desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill executing-plans
if [ $? -eq 0 ]; then
  echo "✅ executing-plans instalado correctamente."
else
  echo "❌ Error al instalar executing-plans."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-comic desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-comic
if [ $? -eq 0 ]; then
  echo "✅ baoyu-comic instalado correctamente."
else
  echo "❌ Error al instalar baoyu-comic."
fi
echo "------------------------------------------"

echo "Instalando: brand-guidelines desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill brand-guidelines
if [ $? -eq 0 ]; then
  echo "✅ brand-guidelines instalado correctamente."
else
  echo "❌ Error al instalar brand-guidelines."
fi
echo "------------------------------------------"

echo "Instalando: internal-comms desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill internal-comms
if [ $? -eq 0 ]; then
  echo "✅ internal-comms instalado correctamente."
else
  echo "❌ Error al instalar internal-comms."
fi
echo "------------------------------------------"

echo "Instalando: subagent-driven-development desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill subagent-driven-development
if [ $? -eq 0 ]; then
  echo "✅ subagent-driven-development instalado correctamente."
else
  echo "❌ Error al instalar subagent-driven-development."
fi
echo "------------------------------------------"

echo "Instalando: template-skill desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill template-skill
if [ $? -eq 0 ]; then
  echo "✅ template-skill instalado correctamente."
else
  echo "❌ Error al instalar template-skill."
fi
echo "------------------------------------------"

echo "Instalando: verification-before-completion desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill verification-before-completion
if [ $? -eq 0 ]; then
  echo "✅ verification-before-completion instalado correctamente."
else
  echo "❌ Error al instalar verification-before-completion."
fi
echo "------------------------------------------"

echo "Instalando: using-superpowers desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill using-superpowers
if [ $? -eq 0 ]; then
  echo "✅ using-superpowers instalado correctamente."
else
  echo "❌ Error al instalar using-superpowers."
fi
echo "------------------------------------------"

echo "Instalando: requesting-code-review desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill requesting-code-review
if [ $? -eq 0 ]; then
  echo "✅ requesting-code-review instalado correctamente."
else
  echo "❌ Error al instalar requesting-code-review."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-post-to-wechat desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-post-to-wechat
if [ $? -eq 0 ]; then
  echo "✅ baoyu-post-to-wechat instalado correctamente."
else
  echo "❌ Error al instalar baoyu-post-to-wechat."
fi
echo "------------------------------------------"

echo "Instalando: agentation desde benjitaylor/agentation..."
npx skills add https://github.com/benjitaylor/agentation --skill agentation
if [ $? -eq 0 ]; then
  echo "✅ agentation instalado correctamente."
else
  echo "❌ Error al instalar agentation."
fi
echo "------------------------------------------"

echo "Instalando: slack-gif-creator desde anthropics/skills..."
npx skills add https://github.com/anthropics/skills --skill slack-gif-creator
if [ $? -eq 0 ]; then
  echo "✅ slack-gif-creator instalado correctamente."
else
  echo "❌ Error al instalar slack-gif-creator."
fi
echo "------------------------------------------"

echo "Instalando: writing-skills desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill writing-skills
if [ $? -eq 0 ]; then
  echo "✅ writing-skills instalado correctamente."
else
  echo "❌ Error al instalar writing-skills."
fi
echo "------------------------------------------"

echo "Instalando: dispatching-parallel-agents desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill dispatching-parallel-agents
if [ $? -eq 0 ]; then
  echo "✅ dispatching-parallel-agents instalado correctamente."
else
  echo "❌ Error al instalar dispatching-parallel-agents."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-post-to-x desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-post-to-x
if [ $? -eq 0 ]; then
  echo "✅ baoyu-post-to-x instalado correctamente."
else
  echo "❌ Error al instalar baoyu-post-to-x."
fi
echo "------------------------------------------"

echo "Instalando: using-git-worktrees desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill using-git-worktrees
if [ $? -eq 0 ]; then
  echo "✅ using-git-worktrees instalado correctamente."
else
  echo "❌ Error al instalar using-git-worktrees."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-compress-image desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-compress-image
if [ $? -eq 0 ]; then
  echo "✅ baoyu-compress-image instalado correctamente."
else
  echo "❌ Error al instalar baoyu-compress-image."
fi
echo "------------------------------------------"

echo "Instalando: release-skills desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill release-skills
if [ $? -eq 0 ]; then
  echo "✅ release-skills instalado correctamente."
else
  echo "❌ Error al instalar release-skills."
fi
echo "------------------------------------------"

echo "Instalando: receiving-code-review desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill receiving-code-review
if [ $? -eq 0 ]; then
  echo "✅ receiving-code-review instalado correctamente."
else
  echo "❌ Error al instalar receiving-code-review."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-danger-gemini-web desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-danger-gemini-web
if [ $? -eq 0 ]; then
  echo "✅ baoyu-danger-gemini-web instalado correctamente."
else
  echo "❌ Error al instalar baoyu-danger-gemini-web."
fi
echo "------------------------------------------"

echo "Instalando: ai-sdk desde vercel/ai..."
npx skills add https://github.com/vercel/ai --skill ai-sdk
if [ $? -eq 0 ]; then
  echo "✅ ai-sdk instalado correctamente."
else
  echo "❌ Error al instalar ai-sdk."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-danger-x-to-markdown desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-danger-x-to-markdown
if [ $? -eq 0 ]; then
  echo "✅ baoyu-danger-x-to-markdown instalado correctamente."
else
  echo "❌ Error al instalar baoyu-danger-x-to-markdown."
fi
echo "------------------------------------------"

echo "Instalando: react:components desde google-labs-code/stitch-skills..."
npx skills add https://github.com/google-labs-code/stitch-skills --skill react:components
if [ $? -eq 0 ]; then
  echo "✅ react:components instalado correctamente."
else
  echo "❌ Error al instalar react:components."
fi
echo "------------------------------------------"

echo "Instalando: finishing-a-development-branch desde obra/superpowers..."
npx skills add https://github.com/obra/superpowers --skill finishing-a-development-branch
if [ $? -eq 0 ]; then
  echo "✅ finishing-a-development-branch instalado correctamente."
else
  echo "❌ Error al instalar finishing-a-development-branch."
fi
echo "------------------------------------------"

echo "Instalando: turborepo desde vercel/turborepo..."
npx skills add https://github.com/vercel/turborepo --skill turborepo
if [ $? -eq 0 ]; then
  echo "✅ turborepo instalado correctamente."
else
  echo "❌ Error al instalar turborepo."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-infographic desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-infographic
if [ $? -eq 0 ]; then
  echo "✅ baoyu-infographic instalado correctamente."
else
  echo "❌ Error al instalar baoyu-infographic."
fi
echo "------------------------------------------"

echo "Instalando: ralph-tui-prd desde subsy/ralph-tui..."
npx skills add https://github.com/subsy/ralph-tui --skill ralph-tui-prd
if [ $? -eq 0 ]; then
  echo "✅ ralph-tui-prd instalado correctamente."
else
  echo "❌ Error al instalar ralph-tui-prd."
fi
echo "------------------------------------------"

echo "Instalando: frontend-design desde anthropics/claude-code..."
npx skills add https://github.com/anthropics/claude-code --skill frontend-design
if [ $? -eq 0 ]; then
  echo "✅ frontend-design instalado correctamente."
else
  echo "❌ Error al instalar frontend-design."
fi
echo "------------------------------------------"

echo "Instalando: typescript-advanced-types desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill typescript-advanced-types
if [ $? -eq 0 ]; then
  echo "✅ typescript-advanced-types instalado correctamente."
else
  echo "❌ Error al instalar typescript-advanced-types."
fi
echo "------------------------------------------"

echo "Instalando: tailwind-design-system desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill tailwind-design-system
if [ $? -eq 0 ]; then
  echo "✅ tailwind-design-system instalado correctamente."
else
  echo "❌ Error al instalar tailwind-design-system."
fi
echo "------------------------------------------"

echo "Instalando: ralph-tui-create-json desde subsy/ralph-tui..."
npx skills add https://github.com/subsy/ralph-tui --skill ralph-tui-create-json
if [ $? -eq 0 ]; then
  echo "✅ ralph-tui-create-json instalado correctamente."
else
  echo "❌ Error al instalar ralph-tui-create-json."
fi
echo "------------------------------------------"

echo "Instalando: humanizer-zh desde op7418/humanizer-zh..."
npx skills add https://github.com/op7418/humanizer-zh --skill humanizer-zh
if [ $? -eq 0 ]; then
  echo "✅ humanizer-zh instalado correctamente."
else
  echo "❌ Error al instalar humanizer-zh."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-image-gen desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-image-gen
if [ $? -eq 0 ]; then
  echo "✅ baoyu-image-gen instalado correctamente."
else
  echo "❌ Error al instalar baoyu-image-gen."
fi
echo "------------------------------------------"

echo "Instalando: shadcn-ui desde giuseppe-trisciuoglio/developer-kit..."
npx skills add https://github.com/giuseppe-trisciuoglio/developer-kit --skill shadcn-ui
if [ $? -eq 0 ]; then
  echo "✅ shadcn-ui instalado correctamente."
else
  echo "❌ Error al instalar shadcn-ui."
fi
echo "------------------------------------------"

echo "Instalando: design-md desde google-labs-code/stitch-skills..."
npx skills add https://github.com/google-labs-code/stitch-skills --skill design-md
if [ $? -eq 0 ]; then
  echo "✅ design-md instalado correctamente."
else
  echo "❌ Error al instalar design-md."
fi
echo "------------------------------------------"

echo "Instalando: ralph-tui-create-beads desde subsy/ralph-tui..."
npx skills add https://github.com/subsy/ralph-tui --skill ralph-tui-create-beads
if [ $? -eq 0 ]; then
  echo "✅ ralph-tui-create-beads instalado correctamente."
else
  echo "❌ Error al instalar ralph-tui-create-beads."
fi
echo "------------------------------------------"

echo "Instalando: api-design-principles desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill api-design-principles
if [ $? -eq 0 ]; then
  echo "✅ api-design-principles instalado correctamente."
else
  echo "❌ Error al instalar api-design-principles."
fi
echo "------------------------------------------"

echo "Instalando: baoyu-url-to-markdown desde jimliu/baoyu-skills..."
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-url-to-markdown
if [ $? -eq 0 ]; then
  echo "✅ baoyu-url-to-markdown instalado correctamente."
else
  echo "❌ Error al instalar baoyu-url-to-markdown."
fi
echo "------------------------------------------"

echo "Instalando: ralph-tui-create-beads-rust desde subsy/ralph-tui..."
npx skills add https://github.com/subsy/ralph-tui --skill ralph-tui-create-beads-rust
if [ $? -eq 0 ]; then
  echo "✅ ralph-tui-create-beads-rust instalado correctamente."
else
  echo "❌ Error al instalar ralph-tui-create-beads-rust."
fi
echo "------------------------------------------"

echo "Instalando: frontend-code-review desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill frontend-code-review
if [ $? -eq 0 ]; then
  echo "✅ frontend-code-review instalado correctamente."
else
  echo "❌ Error al instalar frontend-code-review."
fi
echo "------------------------------------------"

echo "Instalando: postgresql-table-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill postgresql-table-design
if [ $? -eq 0 ]; then
  echo "✅ postgresql-table-design instalado correctamente."
else
  echo "❌ Error al instalar postgresql-table-design."
fi
echo "------------------------------------------"

echo "Instalando: architecture-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill architecture-patterns
if [ $? -eq 0 ]; then
  echo "✅ architecture-patterns instalado correctamente."
else
  echo "❌ Error al instalar architecture-patterns."
fi
echo "------------------------------------------"

echo "Instalando: skill-lookup desde f/awesome-chatgpt-prompts..."
npx skills add https://github.com/f/awesome-chatgpt-prompts --skill skill-lookup
if [ $? -eq 0 ]; then
  echo "✅ skill-lookup instalado correctamente."
else
  echo "❌ Error al instalar skill-lookup."
fi
echo "------------------------------------------"

echo "Instalando: skill-creator desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill skill-creator
if [ $? -eq 0 ]; then
  echo "✅ skill-creator instalado correctamente."
else
  echo "❌ Error al instalar skill-creator."
fi
echo "------------------------------------------"

echo "Instalando: context7 desde intellectronica/agent-skills..."
npx skills add https://github.com/intellectronica/agent-skills --skill context7
if [ $? -eq 0 ]; then
  echo "✅ context7 instalado correctamente."
else
  echo "❌ Error al instalar context7."
fi
echo "------------------------------------------"

echo "Instalando: python-performance-optimization desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill python-performance-optimization
if [ $? -eq 0 ]; then
  echo "✅ python-performance-optimization instalado correctamente."
else
  echo "❌ Error al instalar python-performance-optimization."
fi
echo "------------------------------------------"

echo "Instalando: skill-creator desde supabase/agent-skills..."
npx skills add https://github.com/supabase/agent-skills --skill skill-creator
if [ $? -eq 0 ]; then
  echo "✅ skill-creator instalado correctamente."
else
  echo "❌ Error al instalar skill-creator."
fi
echo "------------------------------------------"

echo "Instalando: vue desde onmax/nuxt-skills..."
npx skills add https://github.com/onmax/nuxt-skills --skill vue
if [ $? -eq 0 ]; then
  echo "✅ vue instalado correctamente."
else
  echo "❌ Error al instalar vue."
fi
echo "------------------------------------------"

echo "Instalando: nodejs-backend-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill nodejs-backend-patterns
if [ $? -eq 0 ]; then
  echo "✅ nodejs-backend-patterns instalado correctamente."
else
  echo "❌ Error al instalar nodejs-backend-patterns."
fi
echo "------------------------------------------"

echo "Instalando: nextjs-app-router-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill nextjs-app-router-patterns
if [ $? -eq 0 ]; then
  echo "✅ nextjs-app-router-patterns instalado correctamente."
else
  echo "❌ Error al instalar nextjs-app-router-patterns."
fi
echo "------------------------------------------"

echo "Instalando: nuxt desde onmax/nuxt-skills..."
npx skills add https://github.com/onmax/nuxt-skills --skill nuxt
if [ $? -eq 0 ]; then
  echo "✅ nuxt instalado correctamente."
else
  echo "❌ Error al instalar nuxt."
fi
echo "------------------------------------------"

echo "Instalando: responsive-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill responsive-design
if [ $? -eq 0 ]; then
  echo "✅ responsive-design instalado correctamente."
else
  echo "❌ Error al instalar responsive-design."
fi
echo "------------------------------------------"

echo "Instalando: vercel-composition-patterns desde vercel-labs/agent-skills..."
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
if [ $? -eq 0 ]; then
  echo "✅ vercel-composition-patterns instalado correctamente."
else
  echo "❌ Error al instalar vercel-composition-patterns."
fi
echo "------------------------------------------"

echo "Instalando: component-refactoring desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill component-refactoring
if [ $? -eq 0 ]; then
  echo "✅ component-refactoring instalado correctamente."
else
  echo "❌ Error al instalar component-refactoring."
fi
echo "------------------------------------------"

echo "Instalando: web-design-guidelines desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill web-design-guidelines
if [ $? -eq 0 ]; then
  echo "✅ web-design-guidelines instalado correctamente."
else
  echo "❌ Error al instalar web-design-guidelines."
fi
echo "------------------------------------------"

echo "Instalando: fastapi-templates desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill fastapi-templates
if [ $? -eq 0 ]; then
  echo "✅ fastapi-templates instalado correctamente."
else
  echo "❌ Error al instalar fastapi-templates."
fi
echo "------------------------------------------"

echo "Instalando: code-review-excellence desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill code-review-excellence
if [ $? -eq 0 ]; then
  echo "✅ code-review-excellence instalado correctamente."
else
  echo "❌ Error al instalar code-review-excellence."
fi
echo "------------------------------------------"

echo "Instalando: mobile-ios-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill mobile-ios-design
if [ $? -eq 0 ]; then
  echo "✅ mobile-ios-design instalado correctamente."
else
  echo "❌ Error al instalar mobile-ios-design."
fi
echo "------------------------------------------"

echo "Instalando: prompt-lookup desde f/awesome-chatgpt-prompts..."
npx skills add https://github.com/f/awesome-chatgpt-prompts --skill prompt-lookup
if [ $? -eq 0 ]; then
  echo "✅ prompt-lookup instalado correctamente."
else
  echo "❌ Error al instalar prompt-lookup."
fi
echo "------------------------------------------"

echo "Instalando: youtube-clipper desde op7418/youtube-clipper-skill..."
npx skills add https://github.com/op7418/youtube-clipper-skill --skill youtube-clipper
if [ $? -eq 0 ]; then
  echo "✅ youtube-clipper instalado correctamente."
else
  echo "❌ Error al instalar youtube-clipper."
fi
echo "------------------------------------------"

echo "Instalando: frontend-testing desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill frontend-testing
if [ $? -eq 0 ]; then
  echo "✅ frontend-testing instalado correctamente."
else
  echo "❌ Error al instalar frontend-testing."
fi
echo "------------------------------------------"

echo "Instalando: sql-optimization-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill sql-optimization-patterns
if [ $? -eq 0 ]; then
  echo "✅ sql-optimization-patterns instalado correctamente."
else
  echo "❌ Error al instalar sql-optimization-patterns."
fi
echo "------------------------------------------"

echo "Instalando: prompt-engineering-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill prompt-engineering-patterns
if [ $? -eq 0 ]; then
  echo "✅ prompt-engineering-patterns instalado correctamente."
else
  echo "❌ Error al instalar prompt-engineering-patterns."
fi
echo "------------------------------------------"

echo "Instalando: vercel-react-best-practices desde langgenius/dify..."
npx skills add https://github.com/langgenius/dify --skill vercel-react-best-practices
if [ $? -eq 0 ]; then
  echo "✅ vercel-react-best-practices instalado correctamente."
else
  echo "❌ Error al instalar vercel-react-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: nestjs-best-practices desde kadajett/agent-nestjs-skills..."
npx skills add https://github.com/kadajett/agent-nestjs-skills --skill nestjs-best-practices
if [ $? -eq 0 ]; then
  echo "✅ nestjs-best-practices instalado correctamente."
else
  echo "❌ Error al instalar nestjs-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: python-testing-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill python-testing-patterns
if [ $? -eq 0 ]; then
  echo "✅ python-testing-patterns instalado correctamente."
else
  echo "❌ Error al instalar python-testing-patterns."
fi
echo "------------------------------------------"

echo "Instalando: logging-best-practices desde boristane/agent-skills..."
npx skills add https://github.com/boristane/agent-skills --skill logging-best-practices
if [ $? -eq 0 ]; then
  echo "✅ logging-best-practices instalado correctamente."
else
  echo "❌ Error al instalar logging-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: tanstack-query desde jezweb/claude-skills..."
npx skills add https://github.com/jezweb/claude-skills --skill tanstack-query
if [ $? -eq 0 ]; then
  echo "✅ tanstack-query instalado correctamente."
else
  echo "❌ Error al instalar tanstack-query."
fi
echo "------------------------------------------"

echo "Instalando: e2e-testing-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill e2e-testing-patterns
if [ $? -eq 0 ]; then
  echo "✅ e2e-testing-patterns instalado correctamente."
else
  echo "❌ Error al instalar e2e-testing-patterns."
fi
echo "------------------------------------------"

echo "Instalando: error-handling-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill error-handling-patterns
if [ $? -eq 0 ]; then
  echo "✅ error-handling-patterns instalado correctamente."
else
  echo "❌ Error al instalar error-handling-patterns."
fi
echo "------------------------------------------"

echo "Instalando: github-actions-templates desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill github-actions-templates
if [ $? -eq 0 ]; then
  echo "✅ github-actions-templates instalado correctamente."
else
  echo "❌ Error al instalar github-actions-templates."
fi
echo "------------------------------------------"

echo "Instalando: design-system-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill design-system-patterns
if [ $? -eq 0 ]; then
  echo "✅ design-system-patterns instalado correctamente."
else
  echo "❌ Error al instalar design-system-patterns."
fi
echo "------------------------------------------"

echo "Instalando: react-native-architecture desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill react-native-architecture
if [ $? -eq 0 ]; then
  echo "✅ react-native-architecture instalado correctamente."
else
  echo "❌ Error al instalar react-native-architecture."
fi
echo "------------------------------------------"

echo "Instalando: monorepo-management desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill monorepo-management
if [ $? -eq 0 ]; then
  echo "✅ monorepo-management instalado correctamente."
else
  echo "❌ Error al instalar monorepo-management."
fi
echo "------------------------------------------"

echo "Instalando: async-python-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill async-python-patterns
if [ $? -eq 0 ]; then
  echo "✅ async-python-patterns instalado correctamente."
else
  echo "❌ Error al instalar async-python-patterns."
fi
echo "------------------------------------------"

echo "Instalando: react-native-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill react-native-design
if [ $? -eq 0 ]; then
  echo "✅ react-native-design instalado correctamente."
else
  echo "❌ Error al instalar react-native-design."
fi
echo "------------------------------------------"

echo "Instalando: react-state-management desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill react-state-management
if [ $? -eq 0 ]; then
  echo "✅ react-state-management instalado correctamente."
else
  echo "❌ Error al instalar react-state-management."
fi
echo "------------------------------------------"

echo "Instalando: modern-javascript-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill modern-javascript-patterns
if [ $? -eq 0 ]; then
  echo "✅ modern-javascript-patterns instalado correctamente."
else
  echo "❌ Error al instalar modern-javascript-patterns."
fi
echo "------------------------------------------"

echo "Instalando: obsidian-markdown desde kepano/obsidian-skills..."
npx skills add https://github.com/kepano/obsidian-skills --skill obsidian-markdown
if [ $? -eq 0 ]; then
  echo "✅ obsidian-markdown instalado correctamente."
else
  echo "❌ Error al instalar obsidian-markdown."
fi
echo "------------------------------------------"

echo "Instalando: visual-design-foundations desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill visual-design-foundations
if [ $? -eq 0 ]; then
  echo "✅ visual-design-foundations instalado correctamente."
else
  echo "❌ Error al instalar visual-design-foundations."
fi
echo "------------------------------------------"

echo "Instalando: web-component-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill web-component-design
if [ $? -eq 0 ]; then
  echo "✅ web-component-design instalado correctamente."
else
  echo "❌ Error al instalar web-component-design."
fi
echo "------------------------------------------"

echo "Instalando: nuxt-ui desde onmax/nuxt-skills..."
npx skills add https://github.com/onmax/nuxt-skills --skill nuxt-ui
if [ $? -eq 0 ]; then
  echo "✅ nuxt-ui instalado correctamente."
else
  echo "❌ Error al instalar nuxt-ui."
fi
echo "------------------------------------------"

echo "Instalando: threejs-animation desde cloudai-x/threejs-skills..."
npx skills add https://github.com/cloudai-x/threejs-skills --skill threejs-animation
if [ $? -eq 0 ]; then
  echo "✅ threejs-animation instalado correctamente."
else
  echo "❌ Error al instalar threejs-animation."
fi
echo "------------------------------------------"

echo "Instalando: planning-with-files desde othmanadi/planning-with-files..."
npx skills add https://github.com/othmanadi/planning-with-files --skill planning-with-files
if [ $? -eq 0 ]; then
  echo "✅ planning-with-files instalado correctamente."
else
  echo "❌ Error al instalar planning-with-files."
fi
echo "------------------------------------------"

echo "Instalando: debugging-strategies desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill debugging-strategies
if [ $? -eq 0 ]; then
  echo "✅ debugging-strategies instalado correctamente."
else
  echo "❌ Error al instalar debugging-strategies."
fi
echo "------------------------------------------"

echo "Instalando: mobile-android-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill mobile-android-design
if [ $? -eq 0 ]; then
  echo "✅ mobile-android-design instalado correctamente."
else
  echo "❌ Error al instalar mobile-android-design."
fi
echo "------------------------------------------"

echo "Instalando: react-dev desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill react-dev
if [ $? -eq 0 ]; then
  echo "✅ react-dev instalado correctamente."
else
  echo "❌ Error al instalar react-dev."
fi
echo "------------------------------------------"

echo "Instalando: auth-implementation-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill auth-implementation-patterns
if [ $? -eq 0 ]; then
  echo "✅ auth-implementation-patterns instalado correctamente."
else
  echo "❌ Error al instalar auth-implementation-patterns."
fi
echo "------------------------------------------"

echo "Instalando: database-schema-designer desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill database-schema-designer
if [ $? -eq 0 ]; then
  echo "✅ database-schema-designer instalado correctamente."
else
  echo "❌ Error al instalar database-schema-designer."
fi
echo "------------------------------------------"

echo "Instalando: microservices-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill microservices-patterns
if [ $? -eq 0 ]; then
  echo "✅ microservices-patterns instalado correctamente."
else
  echo "❌ Error al instalar microservices-patterns."
fi
echo "------------------------------------------"

echo "Instalando: interaction-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill interaction-design
if [ $? -eq 0 ]; then
  echo "✅ interaction-design instalado correctamente."
else
  echo "❌ Error al instalar interaction-design."
fi
echo "------------------------------------------"

echo "Instalando: email-best-practices desde resend/email-best-practices..."
npx skills add https://github.com/resend/email-best-practices --skill email-best-practices
if [ $? -eq 0 ]; then
  echo "✅ email-best-practices instalado correctamente."
else
  echo "❌ Error al instalar email-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: game-changing-features desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill game-changing-features
if [ $? -eq 0 ]; then
  echo "✅ game-changing-features instalado correctamente."
else
  echo "❌ Error al instalar game-changing-features."
fi
echo "------------------------------------------"

echo "Instalando: naming-analyzer desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill naming-analyzer
if [ $? -eq 0 ]; then
  echo "✅ naming-analyzer instalado correctamente."
else
  echo "❌ Error al instalar naming-analyzer."
fi
echo "------------------------------------------"

echo "Instalando: javascript-testing-patterns desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill javascript-testing-patterns
if [ $? -eq 0 ]; then
  echo "✅ javascript-testing-patterns instalado correctamente."
else
  echo "❌ Error al instalar javascript-testing-patterns."
fi
echo "------------------------------------------"

echo "Instalando: openapi-to-typescript desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill openapi-to-typescript
if [ $? -eq 0 ]; then
  echo "✅ openapi-to-typescript instalado correctamente."
else
  echo "❌ Error al instalar openapi-to-typescript."
fi
echo "------------------------------------------"

echo "Instalando: react-useeffect desde softaworks/agent-toolkit..."
npx skills add https://github.com/softaworks/agent-toolkit --skill react-useeffect
if [ $? -eq 0 ]; then
  echo "✅ react-useeffect instalado correctamente."
else
  echo "❌ Error al instalar react-useeffect."
fi
echo "------------------------------------------"

echo "Instalando: deployment-pipeline-design desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill deployment-pipeline-design
if [ $? -eq 0 ]; then
  echo "✅ deployment-pipeline-design instalado correctamente."
else
  echo "❌ Error al instalar deployment-pipeline-design."
fi
echo "------------------------------------------"

echo "Instalando: stitch-loop desde google-labs-code/stitch-skills..."
npx skills add https://github.com/google-labs-code/stitch-skills --skill stitch-loop
if [ $? -eq 0 ]; then
  echo "✅ stitch-loop instalado correctamente."
else
  echo "❌ Error al instalar stitch-loop."
fi
echo "------------------------------------------"

echo "Instalando: uv-package-manager desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill uv-package-manager
if [ $? -eq 0 ]; then
  echo "✅ uv-package-manager instalado correctamente."
else
  echo "❌ Error al instalar uv-package-manager."
fi
echo "------------------------------------------"

echo "Instalando: rag-implementation desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill rag-implementation
if [ $? -eq 0 ]; then
  echo "✅ rag-implementation instalado correctamente."
else
  echo "❌ Error al instalar rag-implementation."
fi
echo "------------------------------------------"

echo "Instalando: architecture-decision-records desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill architecture-decision-records
if [ $? -eq 0 ]; then
  echo "✅ architecture-decision-records instalado correctamente."
else
  echo "❌ Error al instalar architecture-decision-records."
fi
echo "------------------------------------------"

echo "Instalando: stripe-best-practices desde stripe/ai..."
npx skills add https://github.com/stripe/ai --skill stripe-best-practices
if [ $? -eq 0 ]; then
  echo "✅ stripe-best-practices instalado correctamente."
else
  echo "❌ Error al instalar stripe-best-practices."
fi
echo "------------------------------------------"

echo "Instalando: stripe-integration desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill stripe-integration
if [ $? -eq 0 ]; then
  echo "✅ stripe-integration instalado correctamente."
else
  echo "❌ Error al instalar stripe-integration."
fi
echo "------------------------------------------"

echo "Instalando: secrets-management desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill secrets-management
if [ $? -eq 0 ]; then
  echo "✅ secrets-management instalado correctamente."
else
  echo "❌ Error al instalar secrets-management."
fi
echo "------------------------------------------"

echo "Instalando: git-advanced-workflows desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill git-advanced-workflows
if [ $? -eq 0 ]; then
  echo "✅ git-advanced-workflows instalado correctamente."
else
  echo "❌ Error al instalar git-advanced-workflows."
fi
echo "------------------------------------------"

echo "Instalando: data-storytelling desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill data-storytelling
if [ $? -eq 0 ]; then
  echo "✅ data-storytelling instalado correctamente."
else
  echo "❌ Error al instalar data-storytelling."
fi
echo "------------------------------------------"

echo "Instalando: langchain-architecture desde wshobson/agents..."
npx skills add https://github.com/wshobson/agents --skill langchain-architecture
if [ $? -eq 0 ]; then
  echo "✅ langchain-architecture instalado correctamente."
else
  echo "❌ Error al instalar langchain-architecture."
fi
echo "------------------------------------------"

echo "Instalando: vercel-react-native-skills desde vercel-labs/agent-skills..."
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills
if [ $? -eq 0 ]; then
  echo "✅ vercel-react-native-skills instalado correctamente."
else
  echo "❌ Error al instalar vercel-react-native-skills."
fi
echo "------------------------------------------"

echo "Proceso de instalación finalizado."
