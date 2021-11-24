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
		const readingProject = flattenedProjects.byName("🔖 Reading");
		
		selection.window.perspective = Perspective.BuiltIn.Inbox;
		
		const readingTag = tagsMatching('🔖 Reading')[0];
		selection.database.inbox.forEach(function(task){
			if (task.name.startsWith("Waiting")) {
				let waitingTag = database.tagsMatching("Waiting")[0];
				task.addTag(waitingTag);
			}
			
			if (task.name.startsWith('--')) {
				let newTasks = Task.byParsingTransportText(task.name, null);
				if (task.note && task.note.startsWith('--')) {
					// The note looks like Taskpaper, so parse it as such
					let noteTask = Task.byParsingTransportText(task.note, null);
				} else {
					// We don't know which task the note is associated with, so add to all
					newTasks.forEach(newTask => {
						newTask.note = task.note;
					});
				}
				database.deleteObject(task);
			} else if (task.name.toLowerCase().includes('#checkredditpost')) {
				task.name = task.name.replace("#checkredditpost", "");
				task.addTag(readingTag);
				database.moveTasks([task], readingProject);
			} else if (task.name.includes("- IKEA") && task.note.includes("https://www.ikea.com")) {
				let ikeaTag = database.tagsMatching('Ikea')[0];
				task.name = task.name.replace("- IKEA", "");
				task.addTag(ikeaTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Wilko") && task.note.includes("https://www.wilko.com")) {
				let wilkoTag = database.tagsMatching('Wilko')[0];
				task.name = task.name.replace("| Wilko", "").replace("Wilko", "");
				task.addTag(wilkoTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Argos") && task.note.includes("https://www.argos.co.uk")) {
				let argosTag = database.tagsMatching('Argos')[0];
				task.name = task.name.replace("| Argos", "").replace("Buy", "");
				task.addTag(argosTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.name.includes("- B&M") || task.note.includes("https://www.bmstores.co.uk")) {
				let bmTag = database.tagsMatching('B&M')[0];
				task.name = task.name.replace("- B&M", "");
				task.addTag(bmTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.name.includes("| Morrisons") && task.note.includes("morrisons.com")) {
				let morrisonsTag = database.tagsMatching("Morrison's")[0];
				task.name = task.name.replace("| Morrisons", "");
				task.addTag(morrisonsTag);
				database.moveTasks([task], groceriesProject);
			} else if (task.note.includes("aldi.co.uk")) {
				let aldiTag = database.tagsMatching("Aldi")[0];
				task.name = task.name.replace("- ALDI UK", "");
				task.name = task.name.replace("| ALDI", "");
				task.addTag(aldiTag);
				database.moveTasks([task], groceriesProject);
			} else if (task.note.includes("lidl.co.uk")) {
				let lidlTag = database.tagsMatching("Lidl")[0];
				task.name = task.name.replace("- www.lidl.co.uk", "");
				task.name = task.name.replace("- at Lidl UK", "");
				task.addTag(lidlTag);
				database.moveTasks([task], groceriesProject);
			} else if (task.name.includes("ASDA Groceries") && task.note.includes("asda.com")) {
				let asdaTag = database.tagsMatching("Asda")[0];
				task.name = task.name.replace("- ASDA Groceries", "");
				task.addTag(asdaTag);
				database.moveTasks([task], groceriesProject);
			} else if (task.name.includes("Primark") && task.note.includes("primark.com")) {
				let primarkTag = database.tagsMatching("Primark")[0];
				task.name = task.name.split("|").slice(0).join("");
				task.addTag(primarkTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("poundland.co.uk")) {
				let poundlandTag = database.tagsMatching("Poundland")[0];
				task.addTag(poundlandTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("diy.com")) {
				task.name = task.name.split("|").slice(0).join("");
				let bqTag = database.tagsMatching("B&Q")[0];
				task.addTag(bqTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("shop.pimoroni.com")) {
				task.name = task.name.replace("– Pimoroni", "");
				let piTag = database.tagsMatching("Pimoroni")[0];
				task.addTag(piTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("superdrug.com")) {
				task.name = task.name.split("|").slice(0).join("");
				let superdrugTag = database.tagsMatching("Superdrug")[0];
				task.addTag(superdrugTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("apple.com")) {
				if (task.note.includes("apps.apple.com")) {
					let onlineTag = database.tagsMatching("online")[0];
					task.addTag(onlineTag);
				} else {
					task.name = task.name.replace("- Apple (UK)", "");
					let appleTag = database.tagsMatching("Apple")[0];
					task.addTag(appleTag);
					database.moveTasks([task], shoppingProject);
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
				database.moveTasks(childTasks, task);
			} else if (task.note.includes("shoezone.com")) {
				task.name = task.name.split("|").slice(0).join("");
				task.name = task.name.replace("Shoe Zone", "");
				let shoezoneTag = database.tagsMatching("Shoe Zone")[0];
				task.addTag(shoezoneTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("sainsburys.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let sainsburyTag = database.tagsMatching("Sainsbury’s")[0];
				task.addTag(sainsburyTag);
				if (task.note.includes("tuclothing.sainsburys.co.uk")) {
					database.moveTasks([task], shoppingProject);
				} else {
					database.moveTasks([task], groceriesProject);
				}
			} else if (task.note.includes("tesco.com")) {
				task.name = task.name.replace("- Tesco Groceries", "");
				let tescoTag = database.tagsMatching("Tesco")[0];
				task.addTag(tescoTag);
				database.moveTasks([task], groceriesProject);
			} else if (task.note.includes("theworks.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let worksTag = database.tagsMatching("The Works")[0];
				task.addTag(worksTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("theworks.co.uk")) {
				task.name = task.name.split("|").slice(0).join("");
				let worksTag = database.tagsMatching("The Works")[0];
				task.addTag(worksTag);
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("cottonbureau.com")) {
				task.name = task.name.split("|").slice(0).join("").replace("“", '"').replace("”", '"');
				let cbTag = database.tagsMatching("Cotton Bureau")[0];
				let usaTag = database.tagsMatching("🇺🇸 USA")[0];
				task.addTags([cbTag, usaTag]);
				task.appendStringToNote("\n\nJunior Medium");
				database.moveTasks([task], shoppingProject);
			} else if (task.note.includes("youtube.com") || task.note.includes("youtu.be")) {
				let watchTag = database.tagsMatching("📺 Watch")[0];
				task.addTag(watchTag);
				moveIfTitled(task, ["youtube.com", "youtu.be"], "📺 YouTube");
			} else if (task.note.includes("wikipedia.org")) {
				const onlineTag = database.tagsMatching("online")[0];
				task.addTags([readingTag, onlineTag]);
				moveIfTitled(task, ["wikipedia.org"], readingProject);
			} else if (task.note.includes("tvtropes.org")) {
				const onlineTag = database.tagsMatching("online")[0];
				task.addTags([readingTag, onlineTag]);
				moveIfTitled(task, ["tvtropes.org"], readingProject);
			}
			try {
				while (task.name.includes("  ")) {
					task.name = task.name.replace("  ", " ");
				}
				task.name = task.name.trim();
			} catch (error) {
				if (error.message.includes("invalid instance of Task")) {
					return;
				}
				throw error;
			}
		});

			function moveIfTitled(task, disallowedContents, projectName) {
				if (shouldMoveToProject(task)
					&& disallowedContents.some(contents => task.name.includes(contents))
				) {
					let project = typeof projectName === "string" ? flattenedProjects.byName(projectName) : projectName;
					database.moveTasks([task], project);
				}
			}
	});

	action.validate = function(selection, sender){
		// validation code
		// selection options: tasks, projects, folders, tags, allObjects
		return (inbox.length > 0)
	};
        
    return action;
})();

function shouldMoveToProject(task) {
	return task.name.length > 1 && !task.project
}

function moveIfTitled(task, disallowedContents, projectName) {
	if (shouldMoveToProject(task)
		&& disallowedContents.some(contents => task.name.includes(contents))
	) {
		let project = typeof projectName === "string" ? flattenedProjects.byName(projectName) : projectName;
		moveTasks([task], project);
	}
}