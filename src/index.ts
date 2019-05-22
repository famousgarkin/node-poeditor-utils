import * as util from 'util'

import * as PoeditorClient from 'poeditor-client'
const ClientDeprecation = util.deprecate(PoeditorClient, "poeditor-utils Client export, the [poeditor-client](https://github.com/janjakubnanista/poeditor-client) constructor, is deprecated and will be removed in future versions. poeditor-client will be treated as an implementation detail.")
export {ClientDeprecation as Client}

import {getProject, pullTranslations} from './utils'
const getProjectDeprecation = util.deprecate(getProject, "poeditor-utils getProject export, which returns the [poeditor-client](https://github.com/janjakubnanista/poeditor-client) object representation of a project, is deprecated and will be removed in future versions. poeditor-client will be treated as an implementation detail.")
const pullTranslationsDeprecation = util.deprecate(pullTranslations, 'pullTranslations is deprecated and will be removed in future versions. Use a combination of getTranslations, groupTranslations, and formatTranslationsAsJson instead.')
export {
	getProjectDeprecation as getProject,
	pullTranslationsDeprecation as pullTranslations,
}

export {
	getTranslations2 as getTranslations,
	groupTranslations,
	formatTranslationsAsJson,
} from './utils'
