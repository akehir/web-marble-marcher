import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShaderModule, ShaderService } from '@triangular/shader';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';

@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      RpgAwesomeIconsModule,
      ShaderModule.forRoot({
        RESIZE: true,
        SCREENSHOT_KEY_CODE: 'KeyP',
      }),
    ],
  providers: [ShaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
