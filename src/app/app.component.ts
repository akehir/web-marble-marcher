import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ShaderService } from '@triangular/shader';
import { MarbleMarcherFragmentShader } from './shaders';
import { MarbleMarcherVertexShader } from './shaders';
import { take, tap } from 'rxjs/operators';
import { Level } from './types';
import { identity, lookAt } from './util';
import {
  Level1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6,
  Level7,
  Level8,
  Level9,
  Level10,
  Level11,
  Level12,
  Level13,
  Level14,
  Level15,
  Level16,
  Level17,
  Level18,
  Level19,
  Level20,
  Level21,
  Level22,
  Level23,
  Level24,
} from './levels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy {
  title = 'web-marble-marcher';

  start = true;
  menu = true;

  levels: Level[] = [
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    Level6,
    Level7,
    Level8,
    Level9,
    Level10,
    Level11,
    Level12,
    Level13,
    Level14,
    Level15,
    Level16,
    Level17,
    Level18,
    Level19,
    Level20,
    Level21,
    Level22,
    Level23,
    Level24,
  ];

  private listener: (e: KeyboardEvent) => void;

  constructor(private shader: ShaderService) {}

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.listener);
  }

  runLevel(level: Level): void {
    this.shader.createProgram(
      'marble-marcher', // we always set / change the same shader program.
      MarbleMarcherVertexShader,
      MarbleMarcherFragmentShader,
    ).pipe(
      take(1),
      tap((program) => {

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

        //   shader.setUniform("iFracScale", frac_params_smooth[0]);
        program.gl.uniform1f(iFracScale, level.scale);
        //   shader.setUniform("iFracAng1", frac_params_smooth[1]);
        program.gl.uniform1f(iFracAng1, level.angle1);
        //   shader.setUniform("iFracAng2", frac_params_smooth[2]);
        program.gl.uniform1f(iFracAng2, level.angle2);
        //   shader.setUniform("iFracShift", sf::Glsl::Vec3(frac_params_smooth[3], frac_params_smooth[4], frac_params_smooth[5]));
        program.gl.uniform3f(iFracShift, level.offset.x, level.offset.y, level.offset.z);
        //   shader.setUniform("iFracCol", sf::Glsl::Vec3(frac_params_smooth[6], frac_params_smooth[7], frac_params_smooth[8]));
        program.gl.uniform3f(iFracCol, level.color.x, level.color.y, level.color.z);

        // shader.setUniform("iFlagScale", level_copy.planet ? -marble_rad : marble_rad);
        program.gl.uniform1f(iFlagScale, level.isPlanet ? -level.marble.radius : level.marble.radius); // if planet -> Minus
        //   shader.setUniform("iMarbleRad", marble_rad);
        program.gl.uniform1f(iMarbleRad, level.marble.radius);

        //   shader.setUniform("iMarblePos", free_camera ?
        //     sf::Glsl::Vec3(999.0f, 999.0f, 999.0f) :
        //   sf::Glsl::Vec3(marble_pos.x(), marble_pos.y(), marble_pos.z())
        // );
        program.gl.uniform3f(iMarblePos, level.marble.position.x, level.marble.position.y, level.marble.position.z);

        //   shader.setUniform("iFlagPos", free_camera ?
        //     sf::Glsl::Vec3(-999.0f, -999.0f, -999.0f) :
        //   sf::Glsl::Vec3(flag_pos.x(), flag_pos.y(), flag_pos.z())
        // );
        program.gl.uniform3f(iFlagPos, level.flag.position.x, level.flag.position.y, level.flag.position.z);

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

        let cameraPosition = [7, 7, 7];
        const target = [0, 0, 0];
        const up = [0, 1, 0];
        let cameraMatrix = lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

        program.gl.uniformMatrix4fv(iMat, false, cameraMatrix);

        let eclipsed = 0;
        program.step = (dt?) => {
          eclipsed += dt;
          cameraPosition = [cameraPosition[0], 1 + 7 * Math.cos(eclipsed), 1 + 7 * Math.cos(eclipsed)];
          cameraMatrix = lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);
          program.gl.uniformMatrix4fv(iMat, false, cameraMatrix);
        };

        if (this.listener) {
          window.removeEventListener('keyup', this.listener);
        }

        this.listener = (e: KeyboardEvent) => {
          if (e.code === 'NumpadAdd') {
            cameraPosition = [cameraPosition[0] - .1, cameraPosition[1] - .1, cameraPosition[2] - .1];
            // cameraPosition = [7, cameraPosition[1] + 1, 7];
            // cameraPosition = [7, 7, cameraPosition[2] + 1];
          } else if (e.code === 'NumpadSubtract') {
            cameraPosition = [cameraPosition[0] + .1, cameraPosition[1] + .1, cameraPosition[2] + .1];
            // cameraPosition = [7, cameraPosition[1] - 1, 7];
            // cameraPosition = [7, 7, cameraPosition[2] - 1];
          } else if (e.code === 'Escape') {
            this.menu = !this.menu;
          }
        };

        window.addEventListener('keyup', this.listener);
      }),
    ).subscribe();
  }

}
