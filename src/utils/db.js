/**
 * A MongoDB aggregation pipeline stage.
 * @typedef {Object<string, any>} AggregateStage
 */

/**
 * A MongoDB aggregation pipeline.
 * @typedef {AggregateStage[]} AggregatePipeline
 */

/**
 * Pipelines used for search and count operations.
 *
 * @typedef {Object} SearchAggregatePipelines
 * @property {AggregatePipeline} pipelineSearch - Aggregation pipeline used to fetch data
 * @property {AggregatePipeline} pipelineCount  - Aggregation pipeline used to count records
 */

/**
 * Paging options for search queries.
 *
 * @typedef {Object} PagingOptions
 * @property {number} [page]  - Current page number (1-based)
 * @property {number} [limit] - Number of records per page
 * @property {boolean} [all]  - If true, bypass pagination and return all records
 */

/**
 * Search summary metadata.
 *
 * @typedef {Object} SearchSummary
 * @property {number} records - Total number of records
 * @property {number} pages   - Total number of pages
 */

/**
 * Standard search aggregate result.
 *
 * @typedef {Object} SearchAggregateResult
 * @property {Array<any>} data
 * @property {SearchSummary} [summary]
 */

/**
 * Return a standard aggregated search result with data and summary.
 *
 * @param {mongoose.Model} model
 *        Mongoose model used to execute the aggregation.
 *
 * @param {SearchAggregatePipelines} pipelines
 *        Object containing search and count aggregation pipelines.
 *
 * @param {PagingOptions} [paging={}]
 *        Pagination options.
 *
 * @param {boolean} [everyPage=false]
 *        If true, return summary for every page; otherwise only for first page.
 *
 * @returns {Promise<SearchAggregateResult>}
 *          Aggregated search result containing data and optional summary.
 */

const mongoose = require('mongoose');

const pagingConfig = { limit: 30 };

exports.updateOption = {
    useFindAndModify: false,
    upsert: false,
    new: true,
};

exports.upsertOption = {
    useFindAndModify: false,
    upsert: true,
    new: true,
};

exports.updateOnlyOption = {
    useFindAndModify: false,
    upsert: false,
    new: false,
};

/**
 * An array representing the aggregation pipeline stages for MongoDB queries.
 * Each element in the pipeline array is an object that defines a specific stage of the aggregation process.
 * @type {Array<Object> | Object}
 * @returns {Array<Object>} The constructed aggregation pipeline array.
 */
const formMongoPipeline = (...stages) => {
    let pipeline = [];
    stages.forEach(stage => {
        if (Array.isArray(stage)) pipeline.push(...stage);
        else if (stage) pipeline.push(stage);
    });

    return pipeline;
};
exports.formMongoPipeline = formMongoPipeline;

/**
 * Checks if the provided string is a valid 24-character hexadecimal Mongo ObjectId.
 *
 * @param {string} someId - The string to validate as an Mongo ObjectId.
 * @returns {boolean} True if the string is a valid Mongo ObjectId, false otherwise.
 */
const isMongoOid = someId => {
    return new RegExp('^[0-9a-fA-F]{24}$').test(someId);
};
exports.isMongoOid = isMongoOid;

const createMongoOid = (id = null) => {
    if (id) return new mongoose.Types.ObjectId.createFromHexString(id);

    return new mongoose.Types.ObjectId();
};
exports.createMongoOid = createMongoOid;

/**
 * Escapes special regex characters in the given input string
 * and creates a case-insensitive RegExp that matches the input
 * anywhere within a target string.
 *
 * @function safeString
 * @param {string} input - The raw string to be converted into a safe regex.
 * @returns {RegExp|string} A RegExp object if input is provided, otherwise an empty string.
 *
 * @example
 * safeString("cat"); // => /cat/i
 * "The catalog".match(safeString("cat")); // matches "cat" inside "catalog"
 */
const safeString = input => {
    if (input) return new RegExp(input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return "";
};
exports.safeString = safeString;

/**
 * Escapes special regex characters in the given input string
 * and creates a case-insensitive RegExp that matches the input
 * only at the beginning of a target string.
 *
 * @function safeStringWith
 * @param {string} input - The raw string to be converted into a safe regex.
 * @returns {RegExp|string} A RegExp object if input is provided, otherwise an empty string.
 *
 * @example
 * safeStringWith("cat"); // => /^(cat)/i
 * "catalog".match(safeStringWith("cat")); // matches "cat" at start
 * "The catalog".match(safeStringWith("cat")); // no match
 */
const safeStringWith = input => {
    if (input) return new RegExp(`^(${input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
    return "";
};
exports.safeStringWith = safeStringWith;

/**
 * Generates a summary object for paginated search results.
 *
 * @param {number} records
 *        The total number of records found.
 * @param {number} [limit=pagingConfig.limit]
 *        The maximum number of records per page. Default: 30
 * @returns {Promise<{records: number, pages: number}>}
 *        A promise that resolves to an object containing the total records and the number of pages.
 */
const searchSummary = async (records, limit = pagingConfig.limit) => {
    let summary = {
        records,
        pages: Math.ceil(records / limit),
    };
    return summary;
};

/**
 * Aggregates and counts documents in a MongoDB collection using the provided aggregation pipelines,
 * then calculates and returns a summary including the total record count and number of pages.
 *
 * @async
 * @param {mongoose.Model} model
 *        Mongoose model used to execute the aggregation.
 * @param {AggregatePipeline} pipelines
 *        The aggregation count pipeline stages.
 * @param {number} limit
 *        The number of records per page, used to calculate the number of pages.
 * @returns {Promise<{records: number, pages: number}>}
 *        An object containing the total record count and number of pages.
 * @throws {Error}
 *        If the aggregation operation fails.
 */
const searchCount = async (model, pipelines, limit) => {
    const count = {
        $count: 'records'
    };

    pipelines.push(count);

    let summary = {
        records: 0,
        pages: 0,
    };

    try {
        const result = await model.aggregate(pipelines);
        if (result.length > 0) {
            summary = searchSummary(result[0].records, limit);
        }

        return summary;
    } catch (err) {
        throw err;
    }
};

/**
 * Executes an aggregation pipeline on a Mongoose model with optional pagination.
 *
 * @async
 * @param {mongoose.Model} model
 *        Mongoose model used to execute the aggregation.
 * @param {AggregatePipeline} pipelines - The aggregation search pipeline stages.
 * @param {PagingOptions} paging - Pagination options.
 * @returns {Promise<Array<Object>>} The aggregation result.
 * @throws {Error} If the aggregation fails.
 */
const searchOnly = async (model, pipelines, paging) => {
    const { page, limit = pagingConfig.limit, all } = paging;

    if (!all) { // for export to csv, bypass pagination to get all data
        let skipStage;
        const limitStage = { $limit: limit };

        if (page) {
            if (Number(page) === page && page > 0) {
                skipStage = { $skip: (page - 1) * limit };
            }
        }

        if (skipStage) pipelines.push(skipStage);
        pipelines.push(limitStage);
    }

    try {
        const result = await model.aggregate(pipelines);
        return result;
    } catch (err) {
        throw err;
    }
};

/**
 * Return a standard aggregated search result with data and summary.
 *
 * @param {mongoose.Model} model
 *        Mongoose model used to execute the aggregation.
 *
 * @param {SearchAggregatePipelines} pipelines
 *        Object containing search and count aggregation pipelines.
 *
 * @param {PagingOptions} [paging={}]
 *        Pagination options.
 *
 * @param {boolean} [everyPage=false]
 *        If true, return summary for every page; otherwise only for first page.
 *
 * @returns {Promise<SearchAggregateResult>}
 *          Aggregated search result containing data and optional summary.
 */
const searchAggregate = async (model, pipelines = {}, paging = {}, everyPage = false) => {
    const { pipelineCount, pipelineSearch } = pipelines;
    const { page, limit = pagingConfig.limit } = paging;

    let searchResult = {
        data: [],
    }

    const arrFunc = [searchOnly(model, pipelineSearch, paging)];

    if (everyPage || !page || page === 1) {
        arrFunc.push(searchCount(model, pipelineCount, limit));
    }
    try {
        const result = await Promise.all(arrFunc);
        if (result) {
            if (result[0] && result[0].length > 0) searchResult.data = result[0];
            if (result[1]) searchResult.summary = result[1];
        }
        return searchResult;
    } catch (err) {
        throw err;
    }
}
exports.searchAggregate = searchAggregate;

// Example Usage for searchAggregate()
// exports.search = async ({ search = {}, sortBy = { updated: -1 }, paging = {}, everyPage = false }) => {
//     const { freeText } = search;

//     let match = {};
//     if (freeText) {
//         match.$or = [
//             { name: new RegExp(lib.escapeRegExp(freeText), 'i') },
//             { email: new RegExp(lib.escapeRegExp(freeText), 'i') },
//             { mobile: new RegExp(lib.escapeRegExp(freeText), 'i') },
//         ]
//     }

//     const matchStage = { $match: match };

//     const sortStage = { $sort: sortBy };

//     const pipelineCount = db.formPipeline(matchStage);
//     const pipelineSearch = db.formPipeline(pipelineCount, sortStage);

//     try {
//         const result = await db.searchAggregate(agentModel, { pipelineSearch, pipelineCount }, paging, everyPage);
//         return result;
//     } catch (err) {
//         throw err;
//     }
// }