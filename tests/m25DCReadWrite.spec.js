const MaddenDCTools = require('../maddenDcTools');
const fs = require('fs');
const expect = require('chai').expect;

const m25DcPath = 'data/CAREERDRAFT-2024_M25';

it('should read and write a Madden 25 draft class', () => {
    const draftClass = MaddenDCTools.exportDraftClass(m25DcPath);

    expect(draftClass.header.fileName).to.include('Madden-25');
    expect(draftClass.header.numProspects).to.equal(288);
    expect(draftClass.prospects.length).to.equal(288);

    const firstProspect = draftClass.prospects[0];
    expect(firstProspect.firstName).to.equal('Caleb');
    expect(firstProspect.lastName).to.equal('Williams');

    draftClass.prospects[0].firstName = 'John';

    const newBuffer = MaddenDCTools.writeDraftClass(draftClass);
    const newDraftClass = fs.writeFileSync('data/Write_CAREERDRAFT-2024_M25', newBuffer);

    const updatedDraftClass = MaddenDCTools.exportDraftClass('data/Write_CAREERDRAFT-2024_M25');

    expect(updatedDraftClass.header.fileName).to.include('Madden-25');
    expect(updatedDraftClass.header.numProspects).to.equal(288);
    expect(updatedDraftClass.prospects.length).to.equal(288);

    const updatedFirstProspect = updatedDraftClass.prospects[0];

    expect(updatedFirstProspect.firstName).to.equal('John');
});