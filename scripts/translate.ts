import { translations } from '@locale'
import { syncLocales } from 'i18next-locales-sync'
import fs from 'node:fs'
import OpenAI from 'openai'

const spaces = 4
const localesFolder = 'locale/translations'
const primaryLanguage = 'en'
const secondaryLanguages = ['es', 'fr', 'pt']

// Add missing keys

syncLocales({
  // @ts-ignore
  primaryLanguage,
  secondaryLanguages,
  localesFolder,
  useEmptyString: true,
  spaces,
})

// Translate missing keys

for (const languageId of secondaryLanguages) {
  const path = `${localesFolder}/${languageId}.json`
  const translation = (await import(path)).default
  const missingKeys = Object.keys(translation).filter((key) => !translation[key])
  if (missingKeys.length) {
    const update = await translateKeys({ languageId, keys: missingKeys })
    Object.assign(translation, update)
    fs.writeFileSync(path, JSON.stringify(translation, null, spaces))
    console.log(`Updated: ${path}`)
  }
}

// Helpers

async function translateKeys(props: { languageId: string; keys: string[] }) {
  const reference = Object.fromEntries(
    props.keys.map((key) => [key, translations[primaryLanguage][key]])
  )

  const text = await generateResponse({
    json: true,
    messages: [
      {
        role: 'user',
        content: `
          Translate this i18next json to "${props.languageId}" language 
          "${JSON.stringify(reference)}"
        `,
      },
    ],
  })

  const data = JSON.parse(text)
  return data
}

async function generateResponse(props: {
  messages: OpenAI.ChatCompletionCreateParams['messages']
  responseFormat?: any
  timeoutMins?: number
  maxRetries?: number
  json?: boolean
}) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("Provide 'OPENAI_API_KEY' environment variable")
  }

  const openai = new OpenAI({
    apiKey,
    timeout: 1000 * 60 * (props.timeoutMins || 10),
    maxRetries: props.maxRetries,
  })

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: props.messages,
    response_format: props.json ? { type: 'json_object' } : props.responseFormat,
  })

  const content = completion.choices[0]?.message.content
  if (!content) {
    throw new Error('No completion content')
  }

  return content
}
