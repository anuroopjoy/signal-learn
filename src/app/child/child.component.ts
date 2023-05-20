import {
  Component,
  EffectRef,
  Injector,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { isEqual } from 'lodash-es';

interface Task {
  name: string;
  status: boolean;
}

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
})
export class ChildComponent {
  logEffects: WritableSignal<boolean> = signal(false);
  count: WritableSignal<number> = signal(0);
  tasks: WritableSignal<Task[]> = signal([{ name: 'code', status: false }], {
    equal: isEqual,
  });
  factorial: Signal<number> = computed(() => this.#factorial(this.count()));
  effectRef!: EffectRef;

  constructor(private injector: Injector) {
    // this.effectRef = effect((onExit) => {
    //   const timer = setInterval(() => {
    //     console.log(
    //       `Logging is currently ${this.logEffects() ? 'enabled' : 'disabled'}`
    //     );
    //   }, 1000);
    //   if (this.logEffects()) {
    //     console.log('The current task is: ', this.tasks());
    //     console.log('The current number is: ', untracked(this.count));
    //   }

    //   onExit(() => {
    //     clearInterval(timer);
    //     console.log('effects cleaned up');
    //   });
    // });
    // setTimeout(() => {
    this.logEffects.set(true);
    // }, 10000);
  }
  setValue() {
    this.count.set(10);
    // const count = this.count.asReadonly();
  }
  updateValue() {
    this.count.update((val) => val + 1);
  }
  updateList() {
    this.tasks.update((list) => {
      list[0].status = true;
      return [...list];
    });
    // this.tasks.set([{ name: 'code', status: true }]);
  }
  mutateList() {
    this.tasks.mutate((list) => (list[0].status = true));
  }

  #factorial(n: number): number | never {
    if (n < 0) {
      throw new Error('number has to be positive.');
    }
    if (n == 0 || n == 1) {
      return 1;
    } else {
      return n * this.#factorial(n - 1);
    }
  }

  log() {
    this.effectRef = effect(
      (onExit) => {
        const timer = setInterval(() => {
          console.log(
            `Logging is currently ${this.logEffects() ? 'enabled' : 'disabled'}`
          );
        }, 1000);
        if (this.logEffects()) {
          console.log('The current task is: ', this.tasks());
          console.log('The current number is: ', untracked(this.count));
        }

        onExit(() => {
          clearInterval(timer);
          console.log('effects cleaned up');
        });
      },
      { injector: this.injector }
    );
  }

  stopLog() {
    this.effectRef.destroy();
  }
}
