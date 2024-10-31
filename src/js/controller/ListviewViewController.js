/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    items;
    addNewMediaItemElement;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            this.createRandomMediaItem();
        });

        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
        });

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();

        console.log("ListviewViewController()");
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        alert("Element " + itemobj.title + itemobj._id + " wurde ausgewählt!");
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    createRandomMediaItem() {
        const newMediaItem = new entities.MediaItem();
        const randomNumber = Date.now();
        const randomImageSize = Math.floor(Math.random() * 100) + 100;

        newMediaItem.title = `Random Media Item ${randomNumber}`;
        newMediaItem.src = `https://picsum.photos/${randomImageSize}/${randomImageSize}`;
        newMediaItem.create().then(() => {
            this.addToListview(newMediaItem);
        });
        return newMediaItem;
    }

    deleteItem(item) {
        item.delete().then(() => {
            this.removeFromListview(item._id);
        });
    }
    editItem(item) {
        item.title = (item.title + item.title);
        item.update().then(() => {
            this.updateInListview(item._id,item);
        });
    }

    createNewItem() {
        const newItem = new entities.MediaItem("m","https://picsum.photos/100/100");
        newItem.create().then(() => {
            this.addToListview(newItem);
        });
    }
}
