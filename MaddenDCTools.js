// Required modules
const fs = require('fs');
const { FileParser } = require('./utils/FileParser');
const dcFunctions = require('./utils/draftClassFunctions');

// Function to export draft class to JSON
function readDraftClass(buffer)
{
	const dcParser = new FileParser(buffer);
	
	const headerInfo = dcFunctions.parseHeader(dcParser);
	const prospects = dcFunctions.parseProspects(dcParser, headerInfo);

	const draftClass = {
		header: headerInfo,
		prospects: prospects
	};

	return draftClass;
}

// Function to import draft class from JSON
function writeDraftClass(draftClass)
{

	const headerInfo = draftClass.header;

	headerInfo.numProspects = draftClass.prospects.length;

	const dcBuffer = dcFunctions.writeDcFile(headerInfo, draftClass.prospects);

	return dcBuffer;
}

module.exports = {
	readDraftClass,
	writeDraftClass
};