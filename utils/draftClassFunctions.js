// Required modules
const { FileParser } = require('./FileParser');

// Format Constants
const MAX_ENTRY_SIZE = 0x10E2; // 4322 bytes per player entry (M25)
const MAX_VISUALS_SIZE = 0x1000; // 4096 bytes per CharacterVisuals string (M25)
const MAX_PLAYER_DATA_SIZE = 0xE2; // 226 bytes per entry player data (M25)

// String Field Constants
const FIRST_NAME = 0x11;
const LAST_NAME = 0x15;
const HOME_TOWN = 0x1B;
const ASSET_NAME = 0x2A;

function parseHeader(dcParser)
{
    const headerString = dcParser.readBytes(8).toString();

    if(headerString !== "FBCHUNKS")
    {
        throw new Error("This is not a valid draft class file.");
    }

    const header = {};

    header.version = dcParser.readUShort();
    header.headerSize = dcParser.readUInt();
    header.dataSize = dcParser.readUInt();
    header.totalSize = dcParser.readUInt();

    if(header.totalSize !== header.headerSize + header.dataSize)
    {
        console.warn("WARNING: Weird format, total size doesn't match header + data size.");
    }
    
    header.gameYear = dcParser.readUShort();

    for(let i = 0; i < 5; i++)
    {
        header[`unkShort${i}`] = dcParser.readUShort();
    }

    header.fileName = dcParser.readSizedString(21);

    if(!header.fileName.includes("Madden-25"))
    {
        throw new Error("This is not a Madden 25 draft class file.");
    }

    dcParser.readBytes(7); // Unknown null bytes

    header.unkInt = dcParser.readUInt(); // Typically 4

    header.numProspects = dcParser.readUInt();

    return header;
}

function parseProspects(dcParser, header)
{
    const prospects = [];

    const prospectsData = new FileParser(dcParser.readBytes(header.dataSize));

    for(let i = 0; i < header.numProspects; i++)
    {
        const prospect = {};

        const rawProspectData = new FileParser(prospectsData.readBytes(MAX_ENTRY_SIZE));

        parseProspect(rawProspectData, prospect);

        prospects.push(prospect);
    }

    return prospects;
}

function parseProspect(rawProspectData, prospect)
{
    prospect.visuals = JSON.parse(rawProspectData.readSizedString(MAX_VISUALS_SIZE));
    prospect.firstName = rawProspectData.readSizedString(FIRST_NAME);
    prospect.lastName = rawProspectData.readSizedString(LAST_NAME);
    prospect.homeState = rawProspectData.readByte().readUInt8();
    prospect.homeTown = rawProspectData.readSizedString(HOME_TOWN);
    prospect.college = rawProspectData.readUShort();

    prospect.birthDate = rawProspectData.readUShort();
    prospect.age = rawProspectData.readByte().readUInt8();
    prospect.heightInches = rawProspectData.readByte().readUInt8();
    prospect.weight = 160 + rawProspectData.readUShort();

    prospect.position = rawProspectData.readByte().readUInt8();
    prospect.archetype = rawProspectData.readByte().readUInt8();
    prospect.jerseyNum = rawProspectData.readByte().readUInt8();

    prospect.draftable = rawProspectData.readByte().readUInt8();
    prospect.draftPick = rawProspectData.readUShort();
    prospect.draftRound = rawProspectData.readByte().readUInt8();

    // Ratings and traits
    prospect.overall = rawProspectData.readByte().readUInt8();
    prospect.acceleration = rawProspectData.readByte().readUInt8();
    prospect.agility = rawProspectData.readByte().readUInt8();
    prospect.awareness = rawProspectData.readByte().readUInt8();
    prospect.ballCarrierVision = rawProspectData.readByte().readUInt8();
    prospect.blockShedding = rawProspectData.readByte().readUInt8();
    prospect.breakSack = rawProspectData.readByte().readUInt8();
    prospect.breakTackle = rawProspectData.readByte().readUInt8();
    prospect.carrying = rawProspectData.readByte().readUInt8();
    prospect.catching = rawProspectData.readByte().readUInt8();
    prospect.catchInTraffic = rawProspectData.readByte().readUInt8();
    prospect.changeOfDirection = rawProspectData.readByte().readUInt8();
    prospect.finesseMoves = rawProspectData.readByte().readUInt8();
    prospect.hitPower = rawProspectData.readByte().readUInt8();
    prospect.impactBlocking = rawProspectData.readByte().readUInt8();
    prospect.injury = rawProspectData.readByte().readUInt8();
    prospect.jukeMove = rawProspectData.readByte().readUInt8();
    prospect.jumping = rawProspectData.readByte().readUInt8();
    prospect.kickAccuracy = rawProspectData.readByte().readUInt8();
    prospect.kickPower = rawProspectData.readByte().readUInt8();
    prospect.kickReturn = rawProspectData.readByte().readUInt8();
    prospect.leadBlock = rawProspectData.readByte().readUInt8();
    prospect.manCoverage = rawProspectData.readByte().readUInt8();
    prospect.passBlockFinesse = rawProspectData.readByte().readUInt8();
    prospect.passBlockPower = rawProspectData.readByte().readUInt8();
    prospect.passBlock = rawProspectData.readByte().readUInt8();
    prospect.personality = rawProspectData.readByte().readUInt8();
    prospect.playAction = rawProspectData.readByte().readUInt8();
    prospect.playRecognition = rawProspectData.readByte().readUInt8();
    prospect.powerMoves = rawProspectData.readByte().readUInt8();
    prospect.pressCoverage = rawProspectData.readByte().readUInt8();
    prospect.pursuit = rawProspectData.readByte().readUInt8();
    prospect.release = rawProspectData.readByte().readUInt8();
    prospect.shortRouteRunning = rawProspectData.readByte().readUInt8();
    prospect.mediumRouteRunning = rawProspectData.readByte().readUInt8();
    prospect.deepRouteRunning = rawProspectData.readByte().readUInt8();
    prospect.runBlockFinesse = rawProspectData.readByte().readUInt8();
    prospect.runBlockPower = rawProspectData.readByte().readUInt8();
    prospect.runBlock = rawProspectData.readByte().readUInt8();
    prospect.runningStyle = rawProspectData.readByte().readUInt8();
    prospect.spectacularCatch = rawProspectData.readByte().readUInt8();
    prospect.speed = rawProspectData.readByte().readUInt8();
    prospect.spinMove = rawProspectData.readByte().readUInt8();
    prospect.stamina = rawProspectData.readByte().readUInt8();
    prospect.stiffArm = rawProspectData.readByte().readUInt8();
    prospect.strength = rawProspectData.readByte().readUInt8();
    prospect.tackle = rawProspectData.readByte().readUInt8();
    prospect.throwAccuracyDeep = rawProspectData.readByte().readUInt8();
    prospect.throwAccuracyMid = rawProspectData.readByte().readUInt8();
    prospect.throwAccuracy = rawProspectData.readByte().readUInt8();
    prospect.throwAccuracyShort = rawProspectData.readByte().readUInt8();
    prospect.throwOnTheRun = rawProspectData.readByte().readUInt8();
    prospect.throwPower = rawProspectData.readByte().readUInt8();
    prospect.throwUnderPressure = rawProspectData.readByte().readUInt8();
    prospect.toughness = rawProspectData.readByte().readUInt8();
    prospect.trucking = rawProspectData.readByte().readUInt8();
    prospect.zoneCoverage = rawProspectData.readByte().readUInt8();
    prospect.morale = rawProspectData.readByte().readUInt8();
    prospect.traitBigHitter = rawProspectData.readByte().readUInt8();
    prospect.traitPossessionCatch = rawProspectData.readByte().readUInt8();
    prospect.traitClutch = rawProspectData.readByte().readUInt8();
    prospect.traitCoverBall = rawProspectData.readByte().readUInt8();
    prospect.traitDeepBall = rawProspectData.readByte().readUInt8();
    prospect.traitDlBullRush = rawProspectData.readByte().readUInt8();
    prospect.traitDlSpinMove = rawProspectData.readByte().readUInt8();
    prospect.traitDlSwimMove = rawProspectData.readByte().readUInt8();
    prospect.traitDropsOpen = rawProspectData.readByte().readUInt8();
    prospect.traitSidelineCatch = rawProspectData.readByte().readUInt8();
    prospect.traitFightForYards = rawProspectData.readByte().readUInt8();
    prospect.traitUnk1 = rawProspectData.readByte().readUInt8();
    prospect.traitHighMotor = rawProspectData.readByte().readUInt8();
    prospect.traitAggressiveCatch = rawProspectData.readByte().readUInt8();
    prospect.traitPenalty = rawProspectData.readByte().readUInt8();
    prospect.traitPlayBall = rawProspectData.readByte().readUInt8();
    prospect.traitPumpFake = rawProspectData.readByte().readUInt8();
    prospect.traitLbStyle = rawProspectData.readByte().readUInt8();
    prospect.traitSensePressure = rawProspectData.readByte().readUInt8();
    prospect.traitUnk2 = rawProspectData.readByte().readUInt8();
    prospect.traitStripBall = rawProspectData.readByte().readUInt8();
    prospect.traitTackleLow = rawProspectData.readByte().readUInt8();
    prospect.traitThrowAway = rawProspectData.readByte().readUInt8();
    prospect.traitTightSpiral = rawProspectData.readByte().readUInt8();
    prospect.traitTendency = rawProspectData.readByte().readUInt8();
    prospect.traitRunAfterCatch = rawProspectData.readByte().readUInt8();

    prospect.devTrait = rawProspectData.readByte().readUInt8();

    prospect.traitPredictability = rawProspectData.readByte().readUInt8();
    prospect.unkByte2 = rawProspectData.readByte().readUInt8();

    prospect.genericHead = rawProspectData.readUShort();

    prospect.handedness = rawProspectData.readUShort();

    prospect.portraitId = rawProspectData.readUShort();
    
    prospect.qbStyle = rawProspectData.readByte().readUInt8();
    prospect.qbStance = rawProspectData.readByte().readUInt8();

    prospect.unk3 = rawProspectData.readByte().readUInt8();
    prospect.unk4 = rawProspectData.readByte().readUInt8();
    prospect.unk5 = rawProspectData.readByte().readUInt8();
    prospect.unk6 = rawProspectData.readByte().readUInt8();
    prospect.visMoveType = rawProspectData.readByte().readUInt8();
    prospect.unk8 = rawProspectData.readByte().readUInt8();

    prospect.commentaryId = rawProspectData.readUShort();

    prospect.assetName = rawProspectData.readSizedString(ASSET_NAME);
}

function writeDcFile(headerInfo, prospects)
{
    let headerBuffer = Buffer.alloc(0x46);

    headerBuffer.write("FBCHUNKS", 0);
    headerBuffer.writeUInt16LE(headerInfo.version, 8);
    headerBuffer.writeUInt32LE(headerInfo.headerSize, 0xA);
    headerBuffer.writeUInt32LE(headerInfo.dataSize, 0xE);
    headerBuffer.writeUInt32LE(headerInfo.totalSize, 0x12);
    headerBuffer.writeUInt16LE(headerInfo.gameYear, 0x16);

    for(let i = 0; i < 5; i++)
    {
        headerBuffer.writeUInt16LE(headerInfo[`unkShort${i}`], 0x18 + (i * 2));
    }

    headerBuffer.write(headerInfo.fileName, 0x22, 21);

    headerBuffer.writeUInt32LE(headerInfo.unkInt, 0x3E);
    headerBuffer.writeUInt32LE(prospects.length, 0x42);

    const prospectBuffers = writeProspects(prospects);

    headerBuffer = Buffer.concat([headerBuffer, prospectBuffers]);

    const padSize = headerInfo.dataSize - prospectBuffers.length;

    if(padSize < 0)
    {
        console.warn("WARNING: Data size is larger than expected. File may be corrupted.");
    }
    else if(padSize > 0)
    {
        const padBuffer = Buffer.alloc(padSize);

        headerBuffer = Buffer.concat([headerBuffer, padBuffer]);
    }

    return headerBuffer;
}

function writeProspects(prospects)
{
    const prospectBuffers = [];

    for(let i = 0; i < prospects.length; i++)
    {
        const prospect = prospects[i];

        const prospectBuffer = writeProspect(prospect);

        prospectBuffers.push(prospectBuffer);
    }

    return Buffer.concat(prospectBuffers);
}

function writeProspect(prospect)
{
    const visualsBuffer = Buffer.alloc(MAX_VISUALS_SIZE);
    visualsBuffer.write(JSON.stringify(prospect.visuals), 0);

    let prospectBuffer = Buffer.alloc(0);

    const firstName = Buffer.alloc(FIRST_NAME);
    firstName.write(prospect.firstName, 0);

    const lastName = Buffer.alloc(LAST_NAME);
    lastName.write(prospect.lastName, 0);

    const homeState = Buffer.alloc(1);
    homeState.writeUInt8(prospect.homeState, 0);

    const homeTown = Buffer.alloc(HOME_TOWN);
    homeTown.write(prospect.homeTown, 0);

    const college = Buffer.alloc(2);
    college.writeUInt16LE(prospect.college, 0);

    const birthDate = Buffer.alloc(2);
    birthDate.writeUInt16LE(prospect.birthDate, 0);

    const age = Buffer.alloc(1);
    age.writeUInt8(prospect.age, 0);

    const heightInches = Buffer.alloc(1);
    heightInches.writeUInt8(prospect.heightInches, 0);

    const weight = Buffer.alloc(2);
    weight.writeUInt16LE(prospect.weight - 160, 0);

    const position = Buffer.alloc(1);
    position.writeUInt8(prospect.position, 0);
    
    const archetype = Buffer.alloc(1);
    archetype.writeUInt8(prospect.archetype, 0);

    const jerseyNum = Buffer.alloc(1);
    jerseyNum.writeUInt8(prospect.jerseyNum, 0);

    const draftable = Buffer.alloc(1);
    draftable.writeUInt8(prospect.draftable, 0);

    const draftPick = Buffer.alloc(2);
    draftPick.writeUInt16LE(prospect.draftPick, 0);

    const draftRound = Buffer.alloc(1);
    draftRound.writeUInt8(prospect.draftRound, 0);

    const overall = Buffer.alloc(1);
    overall.writeUInt8(prospect.overall, 0);

    const acceleration = Buffer.alloc(1);
    acceleration.writeUInt8(prospect.acceleration, 0);

    const agility = Buffer.alloc(1);
    agility.writeUInt8(prospect.agility, 0);

    const awareness = Buffer.alloc(1);
    awareness.writeUInt8(prospect.awareness, 0);

    const ballCarrierVision = Buffer.alloc(1);
    ballCarrierVision.writeUInt8(prospect.ballCarrierVision, 0);

    const blockShedding = Buffer.alloc(1);
    blockShedding.writeUInt8(prospect.blockShedding, 0);

    const breakSack = Buffer.alloc(1);
    breakSack.writeUInt8(prospect.breakSack, 0);

    const breakTackle = Buffer.alloc(1);
    breakTackle.writeUInt8(prospect.breakTackle, 0);

    const carrying = Buffer.alloc(1);
    carrying.writeUInt8(prospect.carrying, 0);

    const catching = Buffer.alloc(1);
    catching.writeUInt8(prospect.catching, 0);

    const catchInTraffic = Buffer.alloc(1);
    catchInTraffic.writeUInt8(prospect.catchInTraffic, 0);

    const changeOfDirection = Buffer.alloc(1);
    changeOfDirection.writeUInt8(prospect.changeOfDirection, 0);

    const finesseMoves = Buffer.alloc(1);
    finesseMoves.writeUInt8(prospect.finesseMoves, 0);

    const hitPower = Buffer.alloc(1);
    hitPower.writeUInt8(prospect.hitPower, 0);

    const impactBlocking = Buffer.alloc(1);
    impactBlocking.writeUInt8(prospect.impactBlocking, 0);

    const injury = Buffer.alloc(1);
    injury.writeUInt8(prospect.injury, 0);

    const jukeMove = Buffer.alloc(1);
    jukeMove.writeUInt8(prospect.jukeMove, 0);

    const jumping = Buffer.alloc(1);
    jumping.writeUInt8(prospect.jumping, 0);

    const kickAccuracy = Buffer.alloc(1);
    kickAccuracy.writeUInt8(prospect.kickAccuracy, 0);

    const kickPower = Buffer.alloc(1);
    kickPower.writeUInt8(prospect.kickPower, 0);

    const kickReturn = Buffer.alloc(1);
    kickReturn.writeUInt8(prospect.kickReturn, 0);

    const leadBlock = Buffer.alloc(1);
    leadBlock.writeUInt8(prospect.leadBlock, 0);

    const manCoverage = Buffer.alloc(1);
    manCoverage.writeUInt8(prospect.manCoverage, 0);

    const passBlockFinesse = Buffer.alloc(1);
    passBlockFinesse.writeUInt8(prospect.passBlockFinesse, 0);

    const passBlockPower = Buffer.alloc(1);
    passBlockPower.writeUInt8(prospect.passBlockPower, 0);

    const passBlock = Buffer.alloc(1);
    passBlock.writeUInt8(prospect.passBlock, 0);

    const personality = Buffer.alloc(1);
    personality.writeUInt8(prospect.personality, 0);

    const playAction = Buffer.alloc(1);
    playAction.writeUInt8(prospect.playAction, 0);

    const playRecognition = Buffer.alloc(1);
    playRecognition.writeUInt8(prospect.playRecognition, 0);

    const powerMoves = Buffer.alloc(1);
    powerMoves.writeUInt8(prospect.powerMoves, 0);

    const pressCoverage = Buffer.alloc(1);
    pressCoverage.writeUInt8(prospect.pressCoverage, 0);

    const pursuit = Buffer.alloc(1);
    pursuit.writeUInt8(prospect.pursuit, 0);

    const release = Buffer.alloc(1);
    release.writeUInt8(prospect.release, 0);

    const shortRouteRunning = Buffer.alloc(1);
    shortRouteRunning.writeUInt8(prospect.shortRouteRunning, 0);

    const mediumRouteRunning = Buffer.alloc(1);
    mediumRouteRunning.writeUInt8(prospect.mediumRouteRunning, 0);

    const deepRouteRunning = Buffer.alloc(1);
    deepRouteRunning.writeUInt8(prospect.deepRouteRunning, 0);

    const runBlockFinesse = Buffer.alloc(1);
    runBlockFinesse.writeUInt8(prospect.runBlockFinesse, 0);

    const runBlockPower = Buffer.alloc(1);
    runBlockPower.writeUInt8(prospect.runBlockPower, 0);

    const runBlock = Buffer.alloc(1);
    runBlock.writeUInt8(prospect.runBlock, 0);

    const runningStyle = Buffer.alloc(1);
    runningStyle.writeUInt8(prospect.runningStyle, 0);

    const spectacularCatch = Buffer.alloc(1);
    spectacularCatch.writeUInt8(prospect.spectacularCatch, 0);

    const speed = Buffer.alloc(1);
    speed.writeUInt8(prospect.speed, 0);

    const spinMove = Buffer.alloc(1);
    spinMove.writeUInt8(prospect.spinMove, 0);

    const stamina = Buffer.alloc(1);
    stamina.writeUInt8(prospect.stamina, 0);

    const stiffArm = Buffer.alloc(1);
    stiffArm.writeUInt8(prospect.stiffArm, 0);

    const strength = Buffer.alloc(1);
    strength.writeUInt8(prospect.strength, 0);

    const tackle = Buffer.alloc(1);
    tackle.writeUInt8(prospect.tackle, 0);

    const throwAccuracyDeep = Buffer.alloc(1);
    throwAccuracyDeep.writeUInt8(prospect.throwAccuracyDeep, 0);

    const throwAccuracyMid = Buffer.alloc(1);
    throwAccuracyMid.writeUInt8(prospect.throwAccuracyMid, 0);

    const throwAccuracy = Buffer.alloc(1);
    throwAccuracy.writeUInt8(prospect.throwAccuracy, 0);

    const throwAccuracyShort = Buffer.alloc(1);
    throwAccuracyShort.writeUInt8(prospect.throwAccuracyShort, 0);

    const throwOnTheRun = Buffer.alloc(1);
    throwOnTheRun.writeUInt8(prospect.throwOnTheRun, 0);

    const throwPower = Buffer.alloc(1);
    throwPower.writeUInt8(prospect.throwPower, 0);

    const throwUnderPressure = Buffer.alloc(1);
    throwUnderPressure.writeUInt8(prospect.throwUnderPressure, 0);

    const toughness = Buffer.alloc(1);
    toughness.writeUInt8(prospect.toughness, 0);

    const trucking = Buffer.alloc(1);
    trucking.writeUInt8(prospect.trucking, 0);

    const zoneCoverage = Buffer.alloc(1);
    zoneCoverage.writeUInt8(prospect.zoneCoverage, 0);

    const morale = Buffer.alloc(1);
    morale.writeUInt8(prospect.morale, 0);

    const traitBigHitter = Buffer.alloc(1);
    traitBigHitter.writeUInt8(prospect.traitBigHitter, 0);

    const traitPossessionCatch = Buffer.alloc(1);
    traitPossessionCatch.writeUInt8(prospect.traitPossessionCatch, 0);

    const traitClutch = Buffer.alloc(1);
    traitClutch.writeUInt8(prospect.traitClutch, 0);

    const traitCoverBall = Buffer.alloc(1);
    traitCoverBall.writeUInt8(prospect.traitCoverBall, 0);

    const traitDeepBall = Buffer.alloc(1);
    traitDeepBall.writeUInt8(prospect.traitDeepBall, 0);

    const traitDlBullRush = Buffer.alloc(1);
    traitDlBullRush.writeUInt8(prospect.traitDlBullRush, 0);

    const traitDlSpinMove = Buffer.alloc(1);
    traitDlSpinMove.writeUInt8(prospect.traitDlSpinMove, 0);

    const traitDlSwimMove = Buffer.alloc(1);
    traitDlSwimMove.writeUInt8(prospect.traitDlSwimMove, 0);

    const traitDropsOpen = Buffer.alloc(1);
    traitDropsOpen.writeUInt8(prospect.traitDropsOpen, 0);

    const traitSidelineCatch = Buffer.alloc(1);
    traitSidelineCatch.writeUInt8(prospect.traitSidelineCatch, 0);

    const traitFightForYards = Buffer.alloc(1);
    traitFightForYards.writeUInt8(prospect.traitFightForYards, 0);

    const traitUnk1 = Buffer.alloc(1);
    traitUnk1.writeUInt8(prospect.traitUnk1, 0);

    const traitHighMotor = Buffer.alloc(1);
    traitHighMotor.writeUInt8(prospect.traitHighMotor, 0);

    const traitAggressiveCatch = Buffer.alloc(1);
    traitAggressiveCatch.writeUInt8(prospect.traitAggressiveCatch, 0);

    const traitPenalty = Buffer.alloc(1);
    traitPenalty.writeUInt8(prospect.traitPenalty, 0);

    const traitPlayBall = Buffer.alloc(1);
    traitPlayBall.writeUInt8(prospect.traitPlayBall, 0);

    const traitPumpFake = Buffer.alloc(1);
    traitPumpFake.writeUInt8(prospect.traitPumpFake, 0);

    const traitLbStyle = Buffer.alloc(1);
    traitLbStyle.writeUInt8(prospect.traitLbStyle, 0);

    const traitSensePressure = Buffer.alloc(1);
    traitSensePressure.writeUInt8(prospect.traitSensePressure, 0);

    const traitUnk2 = Buffer.alloc(1);
    traitUnk2.writeUInt8(prospect.traitUnk2, 0);

    const traitStripBall = Buffer.alloc(1);
    traitStripBall.writeUInt8(prospect.traitStripBall, 0);

    const traitTackleLow = Buffer.alloc(1);
    traitTackleLow.writeUInt8(prospect.traitTackleLow, 0);

    const traitThrowAway = Buffer.alloc(1);
    traitThrowAway.writeUInt8(prospect.traitThrowAway, 0);

    const traitTightSpiral = Buffer.alloc(1);
    traitTightSpiral.writeUInt8(prospect.traitTightSpiral, 0);

    const traitTendency = Buffer.alloc(1);
    traitTendency.writeUInt8(prospect.traitTendency, 0);

    const traitRunAfterCatch = Buffer.alloc(1);
    traitRunAfterCatch.writeUInt8(prospect.traitRunAfterCatch, 0);

    const devTrait = Buffer.alloc(1);
    devTrait.writeUInt8(prospect.devTrait, 0);

    const traitPredictability = Buffer.alloc(1);
    traitPredictability.writeUInt8(prospect.traitPredictability, 0);

    const unkByte2 = Buffer.alloc(1);
    unkByte2.writeUInt8(prospect.unkByte2, 0);

    const genericHead = Buffer.alloc(2);
    genericHead.writeUInt16LE(prospect.genericHead, 0);

    const handedness = Buffer.alloc(2);
    handedness.writeUInt16LE(prospect.handedness, 0);

    const portraitId = Buffer.alloc(2);
    portraitId.writeUInt16LE(prospect.portraitId, 0);

    const qbStyle = Buffer.alloc(1);
    qbStyle.writeUInt8(prospect.qbStyle, 0);

    const qbStance = Buffer.alloc(1);
    qbStance.writeUInt8(prospect.qbStance, 0);

    const unk3 = Buffer.alloc(1);
    unk3.writeUInt8(prospect.unk3, 0);

    const unk4 = Buffer.alloc(1);
    unk4.writeUInt8(prospect.unk4, 0);

    const unk5 = Buffer.alloc(1);
    unk5.writeUInt8(prospect.unk5, 0);

    const unk6 = Buffer.alloc(1);
    unk6.writeUInt8(prospect.unk6, 0);

    const visMoveType = Buffer.alloc(1);
    visMoveType.writeUInt8(prospect.visMoveType, 0);

    const unk8 = Buffer.alloc(1);
    unk8.writeUInt8(prospect.unk8, 0);

    const commentaryId = Buffer.alloc(2);
    commentaryId.writeUInt16LE(prospect.commentaryId, 0);

    const assetName = Buffer.alloc(ASSET_NAME);
    assetName.write(prospect.assetName, 0);

    prospectBuffer = Buffer.concat([visualsBuffer, prospectBuffer, firstName, lastName, homeState, homeTown, college, birthDate, age, heightInches, weight, position, archetype, jerseyNum, draftable, draftPick, draftRound, overall, acceleration, agility, awareness, ballCarrierVision, blockShedding, breakSack, breakTackle, carrying, catching, catchInTraffic, changeOfDirection, finesseMoves, hitPower, impactBlocking, injury, jukeMove, jumping, kickAccuracy, kickPower, kickReturn, leadBlock, manCoverage, passBlockFinesse, passBlockPower, passBlock, personality, playAction, playRecognition, powerMoves, pressCoverage, pursuit, release, shortRouteRunning, mediumRouteRunning, deepRouteRunning, runBlockFinesse, runBlockPower, runBlock, runningStyle, spectacularCatch, speed, spinMove, stamina, stiffArm, strength, tackle, throwAccuracyDeep, throwAccuracyMid, throwAccuracy, throwAccuracyShort, throwOnTheRun, throwPower, throwUnderPressure, toughness, trucking, zoneCoverage, morale, traitBigHitter, traitPossessionCatch, traitClutch, traitCoverBall, traitDeepBall, traitDlBullRush, traitDlSpinMove, traitDlSwimMove, traitDropsOpen, traitSidelineCatch, traitFightForYards, traitUnk1, traitHighMotor, traitAggressiveCatch, traitPenalty, traitPlayBall, traitPumpFake, traitLbStyle, traitSensePressure, traitUnk2, traitStripBall, traitTackleLow, traitThrowAway, traitTightSpiral, traitTendency, traitRunAfterCatch, devTrait, traitPredictability, unkByte2, genericHead, handedness, portraitId, qbStyle, qbStance, unk3, unk4, unk5, unk6, visMoveType, unk8, commentaryId, assetName]);

    if(prospectBuffer.length !== MAX_ENTRY_SIZE)
    {
        console.warn(`WARNING: Prospect buffer size is not correct. Expected ${MAX_ENTRY_SIZE}, got ${prospectBuffer.length}. File may be corrupted.`);
    }

    return prospectBuffer;
}

module.exports = {
    parseHeader,
    parseProspects,
    writeDcFile
};