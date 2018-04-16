import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventService {
    _avatarEvent: EventEmitter<any> = new EventEmitter();
    private _avatar: any;

    listenAvatarEvent(){
        return this._avatarEvent.emit(this._avatar);
    }

    publishAvatarEvent(avatar){
        this._avatar = avatar;
        this.listenAvatarEvent();
    }
  }