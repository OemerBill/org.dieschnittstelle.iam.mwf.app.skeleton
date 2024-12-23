/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    items;
    addNewMediaItemElement;

    constructor() {
        super();

        console.log("ListviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("header .mwf-img-plus");
        this.addNewMediaItemElement.onclick = (() => {
            this.createNewItem();
        });
        this.addListener(new mwf.EventMatcher("crud","created","MediaItem"), ((event) => {
                this.addToListview(event.data);
            })
        );
        this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"), ((event) => {
                this.updateInListview(event.data._id, event.data);
            })
        );
        this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"), ((event) => {
                this.removeFromListview(event.data);
            })
        );

        // call the superclass once creation is done
        super.oncreate();
    }

    deleteItem(item) {
        item.delete(() => {});
    }

    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {});
                    this.hideDialog();
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });
    }

    async createNewItem() {
        const response = await fetch("https://picsum.photos/1000/1000");
        const image = response.url;
        const newItem = new entities.MediaItem("",image);
        this.showDialog("mediaItemDialog",{
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {});
                    this.hideDialog();
                })
            }
        });
    }

    async onresume() {
        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
        });

        return super.onresume();
    }
}
