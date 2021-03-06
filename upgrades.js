const upgrades = []

const maxOre = {
    name : "Max Ore",
    description : "Increases the maximum capacity of Ore you can store.",
    cost : [100,200,300,400,500,600,700,800,1000,1500,2000,2500,5000,10000,20000,30000,40000,50000,70000,80000,90000,120000],
    value : [50,60,70,80,90,100,120,140,160,180,200,250,300,350,400,450,500,550,600,700,800,900],
    valueSuffix : " Ore Capacity",
}
upgrades.push(maxOre);

const maxWood = {
    name : "Max Wood",
    description : "Increases the maximum capacity of Wood you can store.",
    cost : [100,200,300,400,500,600,700,800,1000,1500,2000,2500,5000,10000,20000,30000,40000,50000,70000,80000,90000,120000],
    value : [50,60,70,80,90,100,120,140,160,180,200,250,300,350,400,450,500,550,600,700,800,900],
    valueSuffix : " Wood Capacity",
}
upgrades.push(maxWood);

const maxLeather = {
    name : "Max Leather",
    description : "Increases the maximum capacity of Leather you can store.",
    cost : [100,200,300,400,500,600,700,800,1000,1500,2000,2500,5000,10000,20000,30000,40000,50000,70000,80000,90000,120000],
    value : [50,60,70,80,90,100,120,140,160,180,200,250,300,350,400,450,500,550,600,700,800,900],
    valueSuffix : " Leather Capacity",
}
upgrades.push(maxLeather);

const maxHerb = {
    name : "Max Herb",
    description : "Increases the maximum capacity of Herb you can store.",
    cost : [100,200,300,400,500,600,700,800,1000,1500,2000,2500,5000,10000,20000,30000,40000,50000,70000,80000,90000,120000],
    value : [50,60,70,80,90,100,120,140,160,180,200,250,300,350,400,450,500,550,600,700,800,900],
    valueSuffix : " Herb Capacity",
}
upgrades.push(maxHerb);

const maxActionSlots = {
    name : "Max Action Slots",
    description : "Increases the number of Action Slots you can have.",
    cost : [2000,4000,10000,25000,50000,75000,100000],
    value : [3,4,5,6,7,8,9,10],
    valueSuffix : " Action Slots"
}
upgrades.push(maxActionSlots);

const maxInventory = {
    name : "Max Inventory Slots",
    description : "Increases the number of Inventory Slots you can have per item.",
    cost : [500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,10000,15000,20000,30000,50000],
    value : [10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,30],
    valueSuffix : " Inventory Slots",
}
upgrades.push(maxInventory);

const autoSell = {
    name : "Auto Sell Value",
    description : "Increases the value of item auto-selling.",
    cost : [2000,4000,8000,12000,16000,20000,40000,60000,80000,100000],
    value : [50,55,60,65,70,75,80,85,90,95],
    valueSuffix : "% Sell Value"
}
upgrades.push(autoSell);

function nameToUpgrade(name) {
    for (let i=0;i<upgrades.length;i++) {
        if (upgrades[i].name == name) return upgrades[i];
    }
    return null;
}

$upgradelist = $("#upgradelist");

function getMaxInventory() {
    return maxInventory.value[upgradeProgress["Max Inventory Slots"]];
}

function refreshUpgrades() {
    $upgradelist.empty();
    for (let i=0;i<upgrades.length;i++) {
        if (upgrades[i].name === "Max Wood" && workerProgress["Eryn"] === 0) continue;
        if (upgrades[i].name === "Max Leather" && workerProgress["Lakur"] === 0) continue;
        if (upgrades[i].name === "Max Herb" && workerProgress["Herbie"] === 0) continue;
        const lvl = upgradeProgress[upgrades[i].name];
        const upgrade = $('<div/>').addClass("Upgrade");
        const d1 = $('<div/>').addClass('upgradeName').html("<h3>"+upgrades[i].name+"</h3>")
        const d2 = $('<div/>').addClass('upgradeDesc').html(upgrades[i].description);
        const d3 = $("<div/>").addClass("upgradeLvl").html("Lvl. " + lvl)
        if (lvl !== upgrades[i].value.length-1) {
            const delta = upgrades[i].value[lvl+1] - upgrades[i].value[lvl]
            const s = "&nbsp;&nbsp;&nbsp;(+" + delta + upgrades[i].valueSuffix + ")";
            d3.append(s);
        }
        if (lvl === 0) d3.addClass("hidden");
        const d4 = $('<div/>').addClass('upgradeCost').html("Cost: "+upgrades[i].cost[lvl]+"&nbsp;"+imageReference["Gold"]);
        const b1 = $("<button/>").addClass("BuyUpgrade").attr("id",upgrades[i].name).html("PURCHASE");
        if (player.money < upgrades[i].cost[lvl]) b1.addClass("upgradeDisable");
        if (lvl === upgrades[i].value.length-1) {
            d4.addClass("hidden");
            b1.addClass("hidden");
        }
        upgrade.append(d1);
        upgrade.append(d2);
        upgrade.append(d3);
        upgrade.append(d4);
        upgrade.append(b1);
        $upgradelist.append(upgrade);
    }
}

$upgradelist.on("click", ".BuyUpgrade", (e) => {
    e.preventDefault();
    upgrade(e.target.id);
    refreshWorkers();
    refreshUpgrades();
});

function upgrade(name) {
    const upgrade = nameToUpgrade(name);
    const cost = upgrade.cost[upgradeProgress[name]];
    if (player.money >= cost) {
        player.money -= cost;
        upgradeProgress[name] += 1;
        if (name === "Max Ore") player.oreCap = upgrade.value[upgradeProgress[name]];
        else if (name === "Max Wood") player.woodCap = upgrade.value[upgradeProgress[name]];
        else if (name === "Max Leather") player.leatherCap = upgrade.value[upgradeProgress[name]];
        else if (name === "Max Herb") player.herbCap = upgrade.value[upgradeProgress[name]];
        else if (name === "Max Action Slots") {
            player.actionSlots.push({
                actionType : "Empty",
                actionName : "Empty",
                actionTime : 0,
            });
        }
        else if (name === "Max Inventory Slots") {
            player.inventoryCap = upgrade.value[upgradeProgress[name]];
        }
        refreshResources();
        ga('send', 'event', 'Upgrades', 'upgrade', name);
    }
}