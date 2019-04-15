import * as util from 'util'

import * as stringify from 'json-stable-stringify'

import {createClient, Project} from './client'
import * as fs from './fs'

export async function getProject(apiToken: string, projectName: string): Promise<Project> {
	const client = createClient(apiToken)
	return Promise.resolve(client.projects.list())
	.then((projects) => projects.find((project) => project.name == projectName))
}

export async function getTranslations(project: Project): Promise<Translation[]> {
	return Promise.resolve(project.languages.list())
	.then((languages) => {
		return Promise.all(
			languages.map((language) => {
				return Promise.resolve(language.terms.list())
				.then((terms) => terms.map((term) => {
					const translation = new LegacyTranslation()
					translation.projectName = project.name
					translation.languageCode = language.code
					translation.term = term.term
					translation.value = term.translation
					return translation
				}))
			})
		)
		.then((translations) => [].concat(...translations))
	})
}

export interface Translation {
	projectName: string
	languageCode: string
	language?: string
	term: string
	value: string
}

export class LegacyTranslation implements Translation {
	projectName: string
	languageCode: string
	term: string
	value: string

	get language(): string {
		return translationGetLanguageDeprecation(this)
	}

	set language(value: string) {
		translationSetLanguageDeprecation(this, value)
	}
}

const translationLanguageDeprecate = (fn) => util.deprecate(fn, 'poeditor-utils Translation.language is deprecated and will be removed in future versions. Please use Translation.languageCode instead.')
const translationGetLanguageDeprecation = translationLanguageDeprecate((translation: Translation) => translation.languageCode)
const translationSetLanguageDeprecation = translationLanguageDeprecate((translation: Translation, value: string) => translation.languageCode = value)

export function groupTranslations(translations: Translation[], grouper: (translation: Translation) => string) {
	return translations.reduce(
		(map, translation) => {
			const key = grouper(translation)
			const translations = map.get(key)
			if (!translations) {
				map.set(key, [translation])
			} else {
				translations.push(translation)
			}
			return map
		},
		new Map<string, Translation[]>(),
	)
}

export function formatTranslations(translations: Translation[]): string {
	return stringify(translations.reduce(
		(obj, translation) => {
			obj[translation.term] = translation.value
			return obj
		},
		{},
	), {
		space: '\t',
	})
}

export type path = string
export type getPathCallback = (translation: Translation) => path

export async function writeTranslations(translations: Translation[], getPathCallback: getPathCallback): Promise<path[]> {
	const translationsByPath = groupTranslations(translations, getPathCallback)
	return Promise.all(
		Array.from(translationsByPath.entries()).map(([path, translations]) => {
			const data = formatTranslations(translations)
			return (<any>fs.writeFileAsync)(path, data).then(() => path)
		})
	)
}

export async function pullTranslations(apiToken: string, projectName: string, getPathCallback: getPathCallback): Promise<path[]> {
	return exports.getProject(apiToken, projectName)
	.then((project) => exports.getTranslations(project))
	.then((translations) => exports.writeTranslations(translations, getPathCallback))
}
