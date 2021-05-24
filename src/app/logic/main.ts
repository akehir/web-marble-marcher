/* eslint-disable */
// c++ code copied -> no linting

// Mocks
// Mocking Scene
import { game_settings, high_scores, music, overlays, rect, renderTexture, sf, shader } from '../mock';
import { GameMode } from '../types';
import {
  fullscreen,
  mouse_sensitivity,
  music_vol,
  num_level_music,
  num_levels, resolution,
  screen_center, screen_size,
  target_fps,
  wheel_sensitivity
} from '../constants';

const scene = {
  GetCurMusic: () => music,
  SetExposure: (amount: number) => {},
  SetMode: (mode: string) => {},
  GetMode: () => '',
  StartNextLevel: () => {},
  StartNewGame: () => {},
  StartSingle: (level: number) => {},
  ResetLevel: () => {},
  GetLevel: () => 0,
  GetParamMod: () => 1,
  EnbaleCheats: () => {},
  Cheat_ColorChange: () => {},
  Cheat_FreeCamera: () => {},
  Cheat_Gravity: () => {},
  Cheat_HyperSpeed: () => {},
  Cheat_IgnoreGoal: () => {},
  Cheat_Motion: () => {},
  Cheat_Planet: () => {},
  Cheat_Zoom: () => {},
  Cheat_Param: (param: number) => {},
  IsSinglePlay: () => false,
  StopAllMusic: () => {},
  UpdateCamera: (cam_lr?: number, cam_ud?: number, cam_z?: number, mouse_clicked?: boolean) => {},
  UpdateMarble: (force_lr: number, force_ud: number) => {},
  Write: (shader: any) => {},
  GetMarble: () => ({ x: 1.0, y: 1.0}),
  GetGoalDirection: () => ({ x: 1.0, y: 1.0, z: 1.0}),
  IsFreeCamera: () => false,
  IsHighScore: () => false,
  IsFullRun: () => false,
  HasCheats: () => false,
  GetCountdownTime: () => 60,
  GetSumTime: () => 60,

};










// Mocking Music

const credits_music = music;
const menu_music = music;

const level_music = [
  music,
  music,
  music,
];

level_music[0].openFromFile('level1_ogg');
level_music[0].setLoop(true);
level_music[1].openFromFile('level2_ogg');
level_music[1].setLoop(true);
level_music[2].openFromFile('level3_ogg');
level_music[2].setLoop(true);
level_music[3].openFromFile('level4_ogg');
level_music[3].setLoop(true);







// Global variables
let mouse_pos = {x: 0, y: 0}; // sf::Vector2i mouse_pos;
let all_keys = []; // all_keys[sf::Keyboard::KeyCount] = { 0 };
let mouse_clicked = false;
let show_cheats = false;
let game_mode = GameMode.MAIN_MENU;

// Helpers
function GetVol(): number {
  if (game_settings.mute) {
    return 0.0;
  } else if (game_mode === GameMode.PAUSED) {
    return music_vol / 4;
  } else {
    return music_vol;
  }
}

function LockMouse(window): void {
  window.setMouseCursorVisible(false);
  const size = window.getSize();
  mouse_pos = { x: size.x / 2, y: size.y / 2};
  sf.Mouse.setPosition(mouse_pos);
}

function UnlockMouse(window): void  {
  window.setMouseCursorVisible(true);
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
function PauseGame(window, _scene): void  {
  game_mode = GameMode.PAUSED;
  _scene.GetCurMusic().setVolume(GetVol());
  UnlockMouse(window);
  _scene.SetExposure(0.5);
}

function DirExists(path): number {
  return 1;
}

// Main loop

let clock = {
  restart: () => {
    return {
      asSeconds: () => 123,
    }
  }
};
let smooth_fps = target_fps;
let lag_ms = 0.0;

class Sprite {
  constructor(texture: any) {

  }

  setScale: (x: number, y: number) => {}
}

while (!document.hidden) { // todo while document active

  // Mock event...
  const event = {
    type: 1,
    key: {
      code: 0,
    },
    mouseButton: {
      button: 0,
      x: 0,
      y: 0,
    },
    mouseMove: {
      x: 0,
      y: 0,
    },
    mouseWheelScroll: {
      delta: 0,
    },
  };

  let mouse_wheel = 0.0;
  while (true /* window.pollEvent(event) */) { // todo: add event listener to window
    if (event.type === sf.Event.Closed) {
      window.close();
      break;
    } else if (event.type === sf.Event.LostFocus) {
      if (game_mode === GameMode.PLAYING) {
        PauseGame(window, scene);
      }
    } else if (event.type === sf.Event.KeyPressed) {
      const keycode = event.key.code;
      if (event.key.code < 0 || event.key.code >= sf.Keyboard.KeyCount) { continue; }
      if (game_mode === GameMode.CREDITS) {
        game_mode = GameMode.MAIN_MENU;
        UnlockMouse(window);
        scene.SetMode('Scene::INTRO');
        scene.SetExposure(1.0);
        credits_music.stop();
        menu_music.setVolume(GetVol());
        menu_music.play();
      } else if (game_mode === GameMode.MIDPOINT) {
        game_mode = GameMode.PLAYING;
        scene.SetExposure(1.0);
        credits_music.stop();
        scene.StartNextLevel();
      } else if (keycode === sf.Keyboard.Escape) {
        if (game_mode === GameMode.MAIN_MENU) {
          window.close();
          break;
        } else if (game_mode === GameMode.CONTROLS || game_mode === GameMode.LEVELS) {
          game_mode = GameMode.MAIN_MENU;
          scene.SetExposure(1.0);
        } else if (game_mode === GameMode.SCREEN_SAVER) {
          game_mode = GameMode.MAIN_MENU;
          scene.SetMode('Scene::INTRO');
          // @ts-ignore todo: this is probably a logical bug
        } else if (game_mode === GameMode.PAUSED) {
          game_mode = GameMode.PLAYING;
          scene.GetCurMusic().setVolume(GetVol());
          scene.SetExposure(1.0);
          LockMouse(window);
        } else if (game_mode === GameMode.PLAYING) {
          PauseGame(window, scene);
        }
      } else if (keycode === sf.Keyboard.R) {
        if (game_mode === GameMode.PLAYING) {
          scene.ResetLevel();
        }
      } else if (keycode === sf.Keyboard.F1) {
        if (game_mode === GameMode.PLAYING && high_scores.HasCompleted(num_levels - 1)) {
          show_cheats = !show_cheats;
          scene.EnbaleCheats();
        }
      } else if (keycode === sf.Keyboard.C) {
        scene.Cheat_ColorChange();
      } else if (keycode === sf.Keyboard.F) {
        scene.Cheat_FreeCamera();
      } else if (keycode === sf.Keyboard.G) {
        scene.Cheat_Gravity();
      } else if (keycode === sf.Keyboard.H) {
        scene.Cheat_HyperSpeed();
      } else if (keycode === sf.Keyboard.I) {
        scene.Cheat_IgnoreGoal();
      } else if (keycode === sf.Keyboard.M) {
        scene.Cheat_Motion();
      } else if (keycode === sf.Keyboard.P) {
        scene.Cheat_Planet();
      } else if (keycode == sf.Keyboard.Z) {
        if (scene.GetParamMod() === -1) {
          scene.Cheat_Zoom();
        } else {
          scene.Cheat_Param(-1);
        }
      } if (keycode >= sf.Keyboard.Num0 && keycode <= sf.Keyboard.Num9) {
        scene.Cheat_Param(keycode - sf.Keyboard.Num1);
      }
      all_keys[keycode] = true;
    } else if (event.type == sf.Event.KeyReleased) {
      const keycode = event.key.code;
      if (event.key.code < 0 || event.key.code >= sf.Keyboard.KeyCount) { continue; }
      all_keys[keycode] = false;
    } else if (event.type === sf.Event.MouseButtonPressed) {
      if (event.mouseButton.button === sf.Mouse.Left) {
        mouse_pos = {x: event.mouseButton.x, y: event.mouseButton.y};
        mouse_clicked = true;
        if (game_mode === GameMode.MAIN_MENU) {
          const selected = overlays.GetOption('Overlays::PLAY', 'Overlays::EXIT');
          if (selected === 'Overlays::PLAY') {
            game_mode = GameMode.PLAYING;
            menu_music.stop();
            scene.StartNewGame();
            scene.GetCurMusic().setVolume(GetVol());
            scene.GetCurMusic().play();
            LockMouse(window);
          } else if (selected === 'Overlays::CONTROLS') {
            game_mode = GameMode.CONTROLS;
          } else if (selected === 'Overlays::LEVELS') {
            game_mode = GameMode.LEVELS;
            // overlays.GetLevelPage() = 0; // todo ... -> probably scrolling in browser
            scene.SetExposure(0.5);
          } else if (selected === 'Overlays::SCREEN_SAVER') {
            game_mode = GameMode.SCREEN_SAVER;
            scene.SetMode('Scene::SCREEN_SAVER');
          } else if (selected === 'Overlays::EXIT') {
            window.close();
            break;
          }
        } else if (game_mode === GameMode.CONTROLS) {
          const selected = overlays.GetOption('Overlays::BACK', 'Overlays::BACK');
          if (selected === 'Overlays::BACK') {
            game_mode = GameMode.MAIN_MENU;
          }
        } else if (game_mode === GameMode.LEVELS) {
          const selected = overlays.GetOption('Overlays::L0', 'Overlays::BACK2');
          if (selected === 'Overlays::BACK2') {
            game_mode = GameMode.MAIN_MENU;
            scene.SetExposure(1.0);
          } else if (selected == 'Overlays::PREV') {
            // overlays.GetLevelPage() -= 1;// todo ... -> probably scrolling in browser
          } else if (selected == 'Overlays::NEXT') {
            //overlays.GetLevelPage() += 1; // todo ... -> probably scrolling in browser
          } else if (selected >= 'Overlays::L0' && selected <= 'Overlays::L14') {
            // todo: choose level
            const level = 0; // selected - 'Overlays::L0' + overlays.GetLevelPage() * Overlays::LEVELS_PER_PAGE;
            if (high_scores.HasUnlocked(level)) {
              game_mode = GameMode.PLAYING;
              menu_music.stop();
              scene.SetExposure(1.0);
              scene.StartSingle(level);
              scene.GetCurMusic().setVolume(GetVol());
              scene.GetCurMusic().play();
              LockMouse(window);
            }
          }
        } else if (game_mode === GameMode.SCREEN_SAVER) {
          scene.SetMode('Scene::INTRO');
          game_mode = GameMode.MAIN_MENU;
          // @ts-ignore todo: this is probably a logical bug
        } else if (game_mode === GameMode.PAUSED) {
          const selected = overlays.GetOption('Overlays::CONTINUE', 'Overlays::MOUSE');
          if (selected === 'Overlays::CONTINUE') {
            game_mode = GameMode.PLAYING;
            scene.GetCurMusic().setVolume(GetVol());
            scene.SetExposure(1.0);
            LockMouse(window);
          } else if (selected === 'Overlays::RESTART') {
            game_mode = GameMode.PLAYING;
            scene.ResetLevel();
            scene.GetCurMusic().setVolume(GetVol());
            scene.SetExposure(1.0);
            LockMouse(window);
          } else if (selected === 'Overlays::QUIT') {
            if (scene.IsSinglePlay()) {
              game_mode = GameMode.LEVELS;
            } else {
              game_mode = GameMode.MAIN_MENU;
              scene.SetExposure(1.0);
            }
            scene.SetMode('Scene::INTRO');
            scene.StopAllMusic();
            menu_music.setVolume(GetVol());
            menu_music.play();
          } else if (selected === 'Overlays::MUSIC') {
            game_settings.mute = !game_settings.mute;
            for (let i = 0; i < num_level_music; ++i) {
              level_music[i].setVolume(GetVol());
            }
          } else if (selected === 'Overlays::MOUSE') {
            game_settings.mouse_sensitivity = (game_settings.mouse_sensitivity + 1) % 3;
          }
        }
      } else if (event.mouseButton.button == sf.Mouse.Right) {
        if (game_mode === GameMode.PLAYING) {
          scene.ResetLevel();
        }
      }
    } else if (event.type == sf.Event.MouseButtonReleased) {
      if (event.mouseButton.button == sf.Mouse.Left) {
        mouse_pos = {x: event.mouseButton.x, y: event.mouseButton.y};
        mouse_clicked = false;
      }
    } else if (event.type === sf.Event.MouseMoved) {
      mouse_pos = {x: event.mouseMove.x, y:event.mouseMove.y};
    } else if (event.type == sf.Event.MouseWheelScrolled) {
      mouse_wheel += event.mouseWheelScroll.delta;
    }
  }

  //Check if the game was beat
  if (scene.GetMode() === 'Scene::FINAL' && game_mode !== GameMode.CREDITS) {
    game_mode = GameMode.CREDITS;
    scene.StopAllMusic();
    scene.SetExposure(0.5);
    credits_music.play();
  } else if (scene.GetMode() === 'Scene::MIDPOINT' && game_mode !== GameMode.MIDPOINT) {
    game_mode = GameMode.MIDPOINT;
    scene.StopAllMusic();
    scene.SetExposure(0.5);
    credits_music.play();
  }

  // Main game update
  if (game_mode === GameMode.MAIN_MENU) {
    scene.UpdateCamera();
    overlays.UpdateMenu({x: mouse_pos.x, y: mouse_pos.y});
  } else if (game_mode === GameMode.CONTROLS) {
    scene.UpdateCamera();
    overlays.UpdateControls({x: mouse_pos.x, y: mouse_pos.y});
  } else if (game_mode === GameMode.LEVELS) {
    scene.UpdateCamera();
    overlays.UpdateLevels({x: mouse_pos.x, y: mouse_pos.y});
  } else if (game_mode === GameMode.SCREEN_SAVER) {
    scene.UpdateCamera();
  } else if (game_mode === GameMode.PLAYING || game_mode === GameMode.CREDITS || game_mode === GameMode.MIDPOINT) {
    // Collect keyboard input
    // todo... depending on input, set force
    const force_lr = 0.0;
    // const force_lr =
    //   (all_keys[sf.Keyboard.Left] || all_keys[sf.Keyboard.A] ? -1.0 : 0.0) +
    //   (all_keys[sf.Keyboard.Right] || all_keys[sf.Keyboard.D] ? 1.0 : 0.0);
    const force_ud = 0.0;
    // const force_ud =
    //   (all_keys[sf.Keyboard.Down] || all_keys[sf.Keyboard.S] ? -1.0 : 0.0) +
    //   (all_keys[sf.Keyboard.Up] || all_keys[sf.Keyboard.W] ? 1.0 : 0.0);

    // Collect mouse input
    const mouse_delta = {x: mouse_pos.x - screen_center.x, y: mouse_pos.y - screen_center.y};
    sf.Mouse.setPosition(screen_center);
    let ms = mouse_sensitivity;
    if (game_settings.mouse_sensitivity === 1) {
      ms *= 0.5;
    } else if (game_settings.mouse_sensitivity === 2) {
      ms *= 0.25;
    }
    const cam_lr = -mouse_delta.x * ms;
    const cam_ud = -mouse_delta.y * ms;
    const cam_z = mouse_wheel * wheel_sensitivity;

    //Apply forces to marble and camera
    scene.UpdateMarble(force_lr, force_ud);
    scene.UpdateCamera(cam_lr, cam_ud, cam_z, mouse_clicked);
  } else if (game_mode === GameMode.PAUSED) {
    overlays.UpdatePaused({x: mouse_pos.x, y: mouse_pos.y});
  }

  let skip_frame = false;
  if (lag_ms >= 1000.0 / target_fps) {
    //If there is too much lag, just do another frame of physics and skip the draw
    lag_ms -= 1000.0 / target_fps;
    skip_frame = true;
  } else {
    //Update the shader values
    scene.Write(shader);

    //Setup full-screen shader
    let states = sf.RenderStates.Default;
    states.shader = shader;

    //Draw the fractal
    if (fullscreen) {
      //Draw to the render texture
      renderTexture.draw(rect, states);
      renderTexture.display();

      //Draw render texture to main window
      const sprite = new Sprite(renderTexture.getTexture());
      sprite.setScale(screen_size.x / resolution.x,
        screen_size.y / resolution.y);
      // window.draw(sprite); // todo main loop
    } else {
      //Draw directly to the main window
      // window.draw(rect, states); // todo main loop
    }
  }

  //Draw text overlays to the window
  if (game_mode === GameMode.MAIN_MENU) {
    overlays.DrawMenu(window);
  } else if (game_mode == GameMode.CONTROLS) {
    overlays.DrawControls(window);
  } else if (game_mode === GameMode.LEVELS) {
    overlays.DrawLevels(window);
  } else if (game_mode === GameMode.PLAYING) {
    if (scene.GetMode() === 'Scene::ORBIT' && scene.GetMarble().x < 998.0) {
      overlays.DrawLevelDesc(window, scene.GetLevel());
    } else if (scene.GetMode() === 'Scene::MARBLE' && !scene.IsFreeCamera()) {
      overlays.DrawArrow(window, scene.GetGoalDirection());
    }
    if (!scene.HasCheats() || scene.GetCountdownTime() < 4 * 60) {
      overlays.DrawTimer(window, scene.GetCountdownTime(), scene.IsHighScore());
    }
    if (!scene.HasCheats() && scene.IsFullRun() && !scene.IsFreeCamera()) {
      overlays.DrawSumTime(window, scene.GetSumTime());
    }
    if (scene.HasCheats() && !scene.IsFreeCamera()) {
      overlays.DrawCheatsEnabled(window);
    }
    if (show_cheats) {
      overlays.DrawCheats(window);
    }
    // @ts-ignore todo: logical error?
  } else if (game_mode === GameMode.PAUSED) {
    overlays.DrawPaused(window);
    if (scene.HasCheats()) {
      overlays.DrawCheatsEnabled(window);
    }
  } else if (game_mode === GameMode.CREDITS) {
    overlays.DrawCredits(window, scene.IsFullRun(), scene.GetSumTime());
  } else if (game_mode === GameMode.MIDPOINT) {
    overlays.DrawMidPoint(window, scene.IsFullRun(), scene.GetSumTime());
  }
  if (!scene.IsFreeCamera()) {
    overlays.DrawFPS(window, Math.floor(smooth_fps + 0.5));
  }

  if (!skip_frame) {
    //Finally display to the screen
    // window.display(); // todo: main loop

    //If V-Sync is running higher than desired fps, slow down!
    const s = clock.restart().asSeconds();
    if (s > 0.0) {
      smooth_fps = smooth_fps*0.9 + Math.min(1.0 / s, target_fps)*0.1;
    }
    const time_diff_ms = 1000.0 * (1.0 / target_fps - s);
    if (time_diff_ms > 0) {
      sf.sleep(time_diff_ms / 1000.0);
      lag_ms = Math.max(lag_ms - time_diff_ms, 0.0);
    } else if (time_diff_ms < 0) {
      lag_ms += Math.max(-time_diff_ms, 0.0);
    }
  }
}

//Stop all music
menu_music.stop();
scene.StopAllMusic();
credits_music.stop();
high_scores.Save('save_file');
game_settings.Save('settings_file');
