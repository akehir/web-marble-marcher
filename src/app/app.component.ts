import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { delay, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ShaderService } from '@triangular/shader';
import { Program } from '@triangular/shader/lib/common';
import { MarbleMarcherFragmentShader } from './shaders';
import { MarbleMarcherVertexShader } from './shaders';
import { Level } from './types';
import { identity, lookAt } from './util';
import { all_levels, Level1, Level22 } from './levels';
import { Scene2 } from './logic/scene2';
import { RpgAwesomeIconsRegistry } from '@triangular/rpg-awesome-icons';
import { rpgAwesomeIconCog } from '@triangular/rpg-awesome-icons/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'web-marble-marcher';

  start = true;
  menu = false;
  levels: Level[] = all_levels;
  scene: Scene2;

  update$: Subject<boolean> = new BehaviorSubject(true);

  mode = {
    mode: 'game',
    label: 'Game'
  };

  modes =  [
    {
      mode: 'wallpaper',
      label: 'Wallpaper'
    },
    {
      mode: 'game',
      label: 'Game'
    },
  ];

  resolution = {
    factor: 1,
    label: 'High'
  };

  resolutions = [
    {
      factor: 0.0625,
      label: 'Super Low'
    },
    {
      factor: 0.125,
      label: 'Very Low'
    },
    {
      factor: 0.25,
      label: 'Low'
    },
    {
      factor: 0.5,
      label: 'Normal'
    },
    {
      factor: 1,
      label: 'High'
    },
  ];

  program$: Observable<Program>;

  level$ = new ReplaySubject<Level>(1);

  private keyboardListener: (e: KeyboardEvent) => void;

  constructor(
    private zone: NgZone,
    private change: ChangeDetectorRef,
    private shader: ShaderService,
    private registry: RpgAwesomeIconsRegistry,
  ) {
    registry.registerIcons([
      rpgAwesomeIconCog,
    ]);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.level$.complete();

    // remove event listeners
    this.unsetListeners();

    // Clean up Scene.
    if (this.scene) {
      this.scene.RemoveEventListeners();
    }
  }

  toggleMenu(): void {
    this.menu = !this.menu;
  }

  updateMode(mode: {mode: string, label: string}): void {
    this.update$.next(true);
    this.mode = mode;
  }

  updateResolution(resolution: { factor: number, label: string}): void {
    // this.update$.next(true); // not required
    this.resolution = resolution;
    this.shader.RESOLUTION_FACTOR = resolution.factor;
  }

  pauseGame(): void {}
  unPauseGame(): void {}
  setExposure(): void {}

  setListeners(): void {
    // remove an
    this.unsetListeners();

    // Collect keyboard input
    // const float force_lr =
    //   (all_keys[sf::Keyboard::Left] || all_keys[sf::Keyboard::A] ? -1.0f : 0.0f) +
    //   (all_keys[sf::Keyboard::Right] || all_keys[sf::Keyboard::D] ? 1.0f : 0.0f);
    // const float force_ud =
    //   (all_keys[sf::Keyboard::Down] || all_keys[sf::Keyboard::S] ? -1.0f : 0.0f) +
    //   (all_keys[sf::Keyboard::Up] || all_keys[sf::Keyboard::W] ? 1.0f : 0.0f);

    // Collect mouse input
    // const sf::Vector2i mouse_delta = mouse_pos - screen_center;
    // sf::Mouse::setPosition(screen_center, window);
    // float ms = mouse_sensitivity;
    // if (game_settings.mouse_sensitivity == 1) {
    //   ms *= 0.5f;
    // } else if (game_settings.mouse_sensitivity == 2) {
    //   ms *= 0.25f;
    // }
    // const float cam_lr = float(-mouse_delta.x) * ms;
    // const float cam_ud = float(-mouse_delta.y) * ms;
    // const float cam_z = mouse_wheel * wheel_sensitivity;

    // scene.UpdateMarble(force_lr, force_ud);
    // scene.UpdateCamera(cam_lr, cam_ud, cam_z, mouse_clicked);
  }

  unsetListeners(): void {
    if (this.keyboardListener) {
      window.removeEventListener('keyup', this.keyboardListener);
    }
  }

  toggleCameraAnimation(): void {

  }

  updateMarble(): void { }

  updateCamera(): void {}

  runLevel(level: Level): void {
    this.level$.next(level);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // initializing all the streams we're interested in.
      // this is where the magic happens!
      this.shader.RESOLUTION_FACTOR = this.resolution.factor;

      this.program$ = this.shader.createProgram(
        'marble-marcher',
        MarbleMarcherVertexShader,
        MarbleMarcherFragmentShader,
      ).pipe(
        take(1),
        shareReplay(1),
      );

      this.program$.subscribe(program => {
        this.scene = new Scene2(program);
        this.scene.AddEventListeners();
      });

      // this.level$.next(Level22);
      this.level$.next(Level1);

      combineLatest([
        this.program$,
        this.level$.asObservable(),
        this.update$.asObservable(),
      ]).pipe(
        delay(16),
        switchMap(([program, level]) => {
          if (this.mode.mode === 'game') {
            // to play the game, we return the gamemode.
            return of([program, level]).pipe(
              this.gameMode(),
            );
          }

          // default we return the wallpapermode
          return of([program, level]).pipe(
            this.wallpaperMode(),
          );
        }),
      ).subscribe();
    });
  }

  // tslint:disable-next-line:typedef
  private wallpaperMode() {
    return tap(([program, level]) => {

      this.start = false;
      this.menu = false;
      const iMat = program.gl.getUniformLocation(program.program, 'iMat');

      const iFracScale = program.gl.getUniformLocation(program.program, 'iFracScale');
      const iFracAng1 = program.gl.getUniformLocation(program.program, 'iFracAng1');
      const iFracAng2 = program.gl.getUniformLocation(program.program, 'iFracAng2');
      const iFracShift = program.gl.getUniformLocation(program.program, 'iFracShift');
      const iFracCol = program.gl.getUniformLocation(program.program, 'iFracCol');
      const iMarblePos = program.gl.getUniformLocation(program.program, 'iMarblePos');
      const iMarbleRad = program.gl.getUniformLocation(program.program, 'iMarbleRad');
      const iFlagScale = program.gl.getUniformLocation(program.program, 'iFlagScale');
      const iFlagPos = program.gl.getUniformLocation(program.program, 'iFlagPos');
      const iExposure = program.gl.getUniformLocation(program.program, 'iExposure');

      // before setting any uniforms, we need to bind the program.
      program.bind();

      program.gl.uniform1f(iFracScale, level.scale);
      program.gl.uniform1f(iFracAng1, level.angle1);
      program.gl.uniform1f(iFracAng2, level.angle2);
      program.gl.uniform3f(iFracShift, level.offset.x, level.offset.y, level.offset.z);
      program.gl.uniform3f(iFracCol, level.color.x, level.color.y, level.color.z);
      program.gl.uniform1f(iFlagScale, level.isPlanet ? -level.marble.radius : level.marble.radius); // if planet -> Minus
      program.gl.uniform1f(iMarbleRad, level.marble.radius);
      program.gl.uniform3f(iMarblePos, 999, 999, 999);
      program.gl.uniform3f(iFlagPos, 999, 999, 999);

      //   shader.setUniform("iExposure", exposure);
      program.gl.uniform1f(iExposure, 1.0);


      // todo: set the iMat -> Matrix4...
      const orbitSmooth = 0.995;
      // const float orbit_dist = level_copy.orbit_dist; // ->>> 3.3
      // cam_pos = orbit_pt + perp_vec * (orbit_dist * 2.5f);
      // cam_pos_smooth = cam_pos_smooth*orbit_smooth + cam_pos*(1 - orbit_smooth);
      //   shader.setUniform("iMat", sf::Glsl::Mat4(cam_mat.data()));
      //  cam_mat.block<3, 1>(0, 3) = cam_pos_smooth;
      const uniformsThatAreTheSameForAllObjects = {
        u_lightWorldPos:         [-50, 30, 100],
        u_viewInverse:           identity(),
        u_lightColor:            [1, 1, 1, 1],
      };

      let cameraPosition = [13.37, 13.37, 13.37];
      const target = [0, 0, 0];
      const up = [0, 1, 0];
      let cameraMatrix = lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

      program.gl.uniformMatrix4fv(iMat, false, cameraMatrix);

      let eclipsed = 0;
      let cos = 0;

      program.step = (dt?) => {
        // update camera
        eclipsed += dt;
        cos = Math.cos(eclipsed);
        cameraPosition = [cameraPosition[0], 13.3 * cos, 13.37 * cos];
        cameraMatrix = lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);
        program.gl.uniformMatrix4fv(iMat, false, cameraMatrix);

        // update fractal
        program.gl.uniform1f(iFracScale, level.scale + .5 * cos);
        //   shader.setUniform("iFracAng1", frac_params_smooth[1]);
        program.gl.uniform1f(iFracAng1, level.angle1 + .5 * cos);
        //   shader.setUniform("iFracAng2", frac_params_smooth[2]);
        program.gl.uniform1f(iFracAng2, level.angle2 + .5 * cos);
      };

      if (this.keyboardListener) {
        window.removeEventListener('keyup', this.keyboardListener);
      }

      this.keyboardListener = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          this.menu = !this.menu;
          this.change.detectChanges();
        }
      };

      window.addEventListener('keyup', this.keyboardListener);
    });
  }

  // tslint:disable-next-line:typedef
  private gameMode<T>() {
    return tap(([program, level]) => {

      this.start = false;
      this.menu = false;

      this.scene.LoadLevel(level);

      program.step = (dt) => {
        this.scene.Step(dt);
      };

      if (this.keyboardListener) {
        window.removeEventListener('keyup', this.keyboardListener);
      }

      this.keyboardListener = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          this.menu = !this.menu;
          this.change.detectChanges();
        }
      };

      window.addEventListener('keyup', this.keyboardListener);
    });
  }

}
