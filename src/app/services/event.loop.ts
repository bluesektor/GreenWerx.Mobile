
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { ServiceResult} from '../models/serviceresult';

@Injectable()
export class EventLoop{
  private eventLoop = new Subject();
  eventLoopSource$ = this.eventLoop.asObservable();

  private messageLoop = new Subject();
  messageLoopSource$ = this.messageLoop.asObservable();

  publishMessage(msg: ServiceResult){
    this.messageLoop.next(msg);   
  }

  
  publishEvent(eventType: string){
    this.eventLoop.next(eventType);
  }

  publish(parm: string, code:number = 0,  res:any = null){
   
          //initEventLoops
          switch(parm){
            case 'user:signup':
            case 'user:logout':
              case 'user:login':
                case 'user:session.loaded':
                this.eventLoop.next(parm);
                break;
                //  initMessageLoops()
                case 'console:log':
                  case 'api:ok':
                  case 'api:err':
                  case 'service:err':
                    this.messageLoop.next(parm);   
                    break;
          }
       
    }
  
    
          
     
     

}