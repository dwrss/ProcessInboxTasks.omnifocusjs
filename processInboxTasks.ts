/*{
    "author": "Rosemary Orchard",
    "targets": ["omnifocus"],
    "type": "action",
    "identifier": "com.rosemaryorchard.Process Inbox Tasks",
    "version": "0.1",
    "description": "A plug-in to help me automatically process tasks in my inbox by adding tags and replacing text.",
    "label": "Process Inbox Tasks",
    "mediumLabel": "Process Inbox Tasks",
    "paletteLabel": "Process Inbox Tasks",
    "image": "tray"
}*/
(() => {
    var action = new PlugIn.Action(function(selection, sender){
    	const database = selection.database
		const flattenedProjects = selection.database.flattenedProjects
		let shoppingProject = flattenedProjects.byName("🛍 Shopping");
		let groceriesProject = flattenedProjects.byName("🛒 Grocery Shopping");
		
		selection.window.perspective = Perspective.BuiltIn.Inbox;
		selection.database.inbox.forEach(function(task){
			if (task.name.startsWith("Waiting")) {
				let waitingTag = database.tagsMatching("Waiting")[0];
				task.addTag(waitingTag);
			}
			
			if (task.name.startsWith('--')) {
				let newTask = Task.byParsingTransportText(task.name, null);
				newTask.note = task.note;
				deleteObject(task);
			} else if (task.name.toLowerCase().includes('#checkredditpost')) {
				task.name = task.name.replace("#checkredditpost", "");
				let readingTag = tagsMatching('🔖 Reading')[0];
				task.addTag(readingTag);
				let readingProject = flattenedProjects.byName("🔖 Reading");
				moveTasks([task], readingProject);
			} else if (task.name.includes("- IKEA") && task.note.includes("https://www.ikea.com")) {
				let ikeaTag = tagsMatching('Ikea')[0];
				task.name = task.name.replace("- IKEA", "");
				task.addTag(ikeaTag);
				moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Wilko") && task.note.includes("https://www.wilko.com")) {
				let wilkoTag = tagsMatching('Wilko')[0];
				task.name = task.name.replace("| Wilko", "").replace("Wilko", "");
				task.addTag(wilkoTag);
				moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Argos") && task.note.includes("https://www.argos.co.uk")) {
				let argosTag = tagsMatching('Argos')[0];
				task.name = task.name.replace("| Argos", "").replace("Buy", "");
				task.addTag(argosTag);
				moveTasks([task], shoppingProject);
			} else if (task.name.includes("- B&M") || task.note.includes("https://www.bmstores.co.uk")) {
				let bmTag = tagsMatching('B&M')[0];
				task.name = task.name.replace("- B&M", "");
				task.addTag(bmTag);
				moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Morrisons") && task.note.includes("morrisons.com")) {
				let morrisonsTag = tagsMatching("Morrison's")[0];
				task.name = task.name.replace("| Morrisons", "");
				task.addTag(morrisonsTag);
				moveTasks([task], groceriesProject);
			} else if (task.note.includes("aldi.co.uk")) {
				let aldiTag = tagsMatching("Aldi")[0];
				task.name = task.name.replace("- ALDI UK", "");
				task.name = task.name.replace("| ALDI", "");
				task.addTag(aldiTag);
				moveTasks([task], groceriesProject);
			} else if (task.note.includes("lidl.co.uk")) {
				let lidlTag = tagsMatching("Lidl")[0];
				task.name = task.name.replace("- www.lidl.co.uk", "");
				task.name = task.name.replace("- at Lidl UK", "");
				task.addTag(lidlTag);
				moveTasks([task], groceriesProject);
			} else if (task.name.includes("ASDA Groceries") && task.note.includes("asda.com")) {
				let asdaTag = tagsMatching("Asda")[0];
				task.name = task.name.replace("- ASDA Groceries", "");
				task.addTag(asdaTag);
				moveTasks([task], groceriesProject);
			} else if (task.name.includes("Primark") && task.note.includes("primark.com")) {
				let primarkTag = tagsMatching("Primark")[0];
				task.name = task.name.split("|").slice(0).join("");
				task.addTag(primarkTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("poundland.co.uk")) {
				let poundlandTag = tagsMatching("Poundland")[0];
				task.addTag(poundlandTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("diy.com")) {
				task.name = task.name.split("|").slice(0).join("");
				let bqTag = tagsMatching("B&Q")[0];
				task.addTag(bqTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("shop.pimoroni.com")) {
				task.name = task.name.replace("– Pimoroni", "");
				let piTag = tagsMatching("Pimoroni")[0];
				task.addTag(piTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("superdrug.com")) {
				task.name = task.name.split("|").slice(0).join("");
				let superdrugTag = tagsMatching("Superdrug")[0];
				task.addTag(superdrugTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("apple.com")) {
				if (task.note.includes("apps.apple.com")) {
					let onlineTag = tagsMatching("online")[0];
					task.addTag(onlineTag);
				} else {
					task.name = task.name.replace("- Apple (UK)", "");
					let appleTag = tagsMatching("Apple")[0];
					task.addTag(appleTag);
					moveTasks([task], shoppingProject);
				}
			} else if ((task.note.includes("thingiverse.com") || task.note.includes("prusaprinters.org")) && !task.tags.length) {
				if (task.note.includes("thingiverse.com"))
					task.name = task.name.replace("- Thingiverse", "");
				else if (task.note.includes("prusaprinters.org")) {
					task.name = task.name.split("|").slice(0).join("");
				}
				let printTag = database.tagsMatching("3D Print")[0];
				task.addTag(printTag);
				task.completedByChildren = true;
				task.sequential = true;
				let childTasks = [];
				[
				    "Download File",
				    "Slice File",
				    "Upload to OctoPrint",
				    "Set time on task [Print "+task.name+"] in OmniFocus",
				    "Print " + task.name
				].forEach(function (childTask){
					let newTask = new Task(childTask);
					newTask.note = task.note;
					childTasks.push(newTask);
				});
				moveTasks(childTasks, task);
			} else if (task.note.includes("shoezone.com")) {
				task.name = task.name.split("|").slice(0).join("");
				task.name = task.name.replace("Shoe Zone", "");
				let shoezoneTag = tagsMatching("Shoe Zone")[0];
				task.addTag(shoezoneTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("sainsburys.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let sainsburyTag = tagsMatching("Sainsbury’s")[0];
				task.addTag(sainsburyTag);
				if (task.note.includes("tuclothing.sainsburys.co.uk")) {
					moveTasks([task], shoppingProject);
				} else {
					moveTasks([task], groceriesProject);
				}
			} else if (task.note.includes("tesco.com")) {
				task.name = task.name.replace("- Tesco Groceries", "");
				let tescoTag = tagsMatching("Tesco")[0];
				task.addTag(tescoTag);
				moveTasks([task], groceriesProject);
			} else if (task.note.includes("theworks.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let worksTag = tagsMatching("The Works")[0];
				task.addTag(worksTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("theworks.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let worksTag = tagsMatching("The Works")[0];
				task.addTag(worksTag);
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("cottonbureau.com")) {
				task.name = task.name.split("|").slice(0).join("").replace("“", '"').replace("”", '"');
				let cbTag = tagsMatching("Cotton Bureau")[0];
				let usaTag = tagsMatching("🇺🇸 USA")[0];
				task.addTags([cbTag, usaTag]);
				task.appendStringToNote("\n\nJunior Medium");
				moveTasks([task], shoppingProject);
			} else if (task.note.includes("youtube.com") || task.note.includes("youtu.be")) {
				let watchTag = tagsMatching("📺 Watch")[0];
				task.addTag(watchTag);
				let taskName = task.name;
				if (taskName.length > 1 
					& !task.project
					&& !(taskName.includes("youtube.com") || taskName.includes("youtu.be"))
				) {
					let youtubeProject = flattenedProjects.byName("📺 YouTube");
					moveTasks([task], youtubeProject);
				}
			}
			while (task.name.includes("  ")) {
				task.name = task.name.replace("  ", " ")
			}
			task.name = task.name.trim();
		});
	});

	action.validate = function(selection, sender){
		// validation code
		// selection options: tasks, projects, folders, tags, allObjects
		return (inbox.length > 0)
	};
        
    return action;
})();