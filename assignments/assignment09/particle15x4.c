// -----------------------------------------
// Accelerometer
// -----------------------------------------
// In this example, we're going to register a Particle.variable() with the cloud so that we can read the level of an accelerometer sensor.

int z = A0; // This is the input pin where you read the Z value of the sensor.
int y = A1; // This is the input pin where you read the Y value of the sensor.
int x = A2; // This is the input pin where you read the X value of the sensor.

int analogval_z; // Here we are declaring the integer variable analogvalue, which we will use later to store the value of the sensor.
int analogval_y; // Here we are declaring the integer variable analogvalue, which we will use later to store the value of the sensor.
int analogval_x; // Here we are declaring the integer variable analogvalue, which we will use later to store the value of the sensor.

int last_reset = Time.now();

int m01 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m02 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m03 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m04 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m05 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m06 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m07 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m08 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m09 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m10 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m11 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m12 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m13 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m14 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m15 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m16 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m17 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m18 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m19 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m20 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m21 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m22 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m23 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m24 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m25 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m26 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m27 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m28 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m29 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m30 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m31 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m32 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m33 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m34 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m35 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m36 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m37 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m38 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m39 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m40 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m41 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m42 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m43 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m44 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m45 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m46 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m47 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m48 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m49 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m50 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m51 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m52 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m53 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m54 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m55 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m56 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m57 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m58 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m59 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}
int m60 [] = {0, 0, 0, 0, 0, 0, 0}; // {t, xmin, xmax, ymin, ymax, zmin, zmax}

int xmin = 4000;
int xmax = 0;
int ymin = 4000;
int ymax = 0;
int zmin = 4000;
int zmax = 0;


char q1 [622]; // A placeholder for a string of JSON
char q2 [622]; // A placeholder for a string of JSON
char q3 [622]; // A placeholder for a string of JSON
char q4 [622]; // A placeholder for a string of JSON

void setup() {

    // This lets the device know which pins will be used to read incoming voltages.
    pinMode(z, INPUT);
    pinMode(y, INPUT);
    pinMode(x, INPUT);

    // We are going to declare a Particle.variable() here so that we can access the value of the sensor from the cloud.
    Particle.variable("q1", q1);
    Particle.variable("q2", q2);
    Particle.variable("q3", q3);
    Particle.variable("q4", q4);
    // This is saying that when we ask the cloud for "analogvalue", this will reference the variable analogvalue in this app, which is a double variable.

}

void loop() {
  if (Time.now() - last_reset < 60) {
    // check to see what the value of the sensor is and store it in the int variable analogvalue
    analogval_z = analogRead(z);
    analogval_y = analogRead(y);
    analogval_x = analogRead(x);

    if (analogval_x < xmin) {
      xmin = analogval_x;
    } else if (analogval_x > xmax) {
      xmax = analogval_x;
    }
    if (analogval_y < ymin) {
      ymin = analogval_y;
    } else if (analogval_y > ymax) {
      ymax = analogval_y;
    }
    if (analogval_z < zmin) {
      zmin = analogval_z;
    } else if (analogval_z > zmax) {
      zmax = analogval_z;
    }

    delay(500);

  } else {
    last_reset = Time.now();
    m60[0] = m59[0];
    m60[1] = m59[1];
    m60[2] = m59[2];
    m60[3] = m59[3];
    m60[4] = m59[4];
    m60[5] = m59[5];
    m60[6] = m59[6];
    m59[0] = m58[0];
    m59[1] = m58[1];
    m59[2] = m58[2];
    m59[3] = m58[3];
    m59[4] = m58[4];
    m59[5] = m58[5];
    m59[6] = m58[6];
    m58[0] = m57[0];
    m58[1] = m57[1];
    m58[2] = m57[2];
    m58[3] = m57[3];
    m58[4] = m57[4];
    m58[5] = m57[5];
    m58[6] = m57[6];
    m57[0] = m56[0];
    m57[1] = m56[1];
    m57[2] = m56[2];
    m57[3] = m56[3];
    m57[4] = m56[4];
    m57[5] = m56[5];
    m57[6] = m56[6];
    m56[0] = m55[0];
    m56[1] = m55[1];
    m56[2] = m55[2];
    m56[3] = m55[3];
    m56[4] = m55[4];
    m56[5] = m55[5];
    m56[6] = m55[6];
    m55[0] = m54[0];
    m55[1] = m54[1];
    m55[2] = m54[2];
    m55[3] = m54[3];
    m55[4] = m54[4];
    m55[5] = m54[5];
    m55[6] = m54[6];
    m54[0] = m53[0];
    m54[1] = m53[1];
    m54[2] = m53[2];
    m54[3] = m53[3];
    m54[4] = m53[4];
    m54[5] = m53[5];
    m54[6] = m53[6];
    m53[0] = m52[0];
    m53[1] = m52[1];
    m53[2] = m52[2];
    m53[3] = m52[3];
    m53[4] = m52[4];
    m53[5] = m52[5];
    m53[6] = m52[6];
    m52[0] = m51[0];
    m52[1] = m51[1];
    m52[2] = m51[2];
    m52[3] = m51[3];
    m52[4] = m51[4];
    m52[5] = m51[5];
    m52[6] = m51[6];
    m51[0] = m50[0];
    m51[1] = m50[1];
    m51[2] = m50[2];
    m51[3] = m50[3];
    m51[4] = m50[4];
    m51[5] = m50[5];
    m51[6] = m50[6];
    m50[0] = m49[0];
    m50[1] = m49[1];
    m50[2] = m49[2];
    m50[3] = m49[3];
    m50[4] = m49[4];
    m50[5] = m49[5];
    m50[6] = m49[6];
    m49[0] = m48[0];
    m49[1] = m48[1];
    m49[2] = m48[2];
    m49[3] = m48[3];
    m49[4] = m48[4];
    m49[5] = m48[5];
    m49[6] = m48[6];
    m48[0] = m47[0];
    m48[1] = m47[1];
    m48[2] = m47[2];
    m48[3] = m47[3];
    m48[4] = m47[4];
    m48[5] = m47[5];
    m48[6] = m47[6];
    m47[0] = m46[0];
    m47[1] = m46[1];
    m47[2] = m46[2];
    m47[3] = m46[3];
    m47[4] = m46[4];
    m47[5] = m46[5];
    m47[6] = m46[6];
    m46[0] = m45[0];
    m46[1] = m45[1];
    m46[2] = m45[2];
    m46[3] = m45[3];
    m46[4] = m45[4];
    m46[5] = m45[5];
    m46[6] = m45[6];
    m45[0] = m44[0];
    m45[1] = m44[1];
    m45[2] = m44[2];
    m45[3] = m44[3];
    m45[4] = m44[4];
    m45[5] = m44[5];
    m45[6] = m44[6];
    m44[0] = m43[0];
    m44[1] = m43[1];
    m44[2] = m43[2];
    m44[3] = m43[3];
    m44[4] = m43[4];
    m44[5] = m43[5];
    m44[6] = m43[6];
    m43[0] = m42[0];
    m43[1] = m42[1];
    m43[2] = m42[2];
    m43[3] = m42[3];
    m43[4] = m42[4];
    m43[5] = m42[5];
    m43[6] = m42[6];
    m42[0] = m41[0];
    m42[1] = m41[1];
    m42[2] = m41[2];
    m42[3] = m41[3];
    m42[4] = m41[4];
    m42[5] = m41[5];
    m42[6] = m41[6];
    m41[0] = m40[0];
    m41[1] = m40[1];
    m41[2] = m40[2];
    m41[3] = m40[3];
    m41[4] = m40[4];
    m41[5] = m40[5];
    m41[6] = m40[6];
    m40[0] = m39[0];
    m40[1] = m39[1];
    m40[2] = m39[2];
    m40[3] = m39[3];
    m40[4] = m39[4];
    m40[5] = m39[5];
    m40[6] = m39[6];
    m39[0] = m38[0];
    m39[1] = m38[1];
    m39[2] = m38[2];
    m39[3] = m38[3];
    m39[4] = m38[4];
    m39[5] = m38[5];
    m39[6] = m38[6];
    m38[0] = m37[0];
    m38[1] = m37[1];
    m38[2] = m37[2];
    m38[3] = m37[3];
    m38[4] = m37[4];
    m38[5] = m37[5];
    m38[6] = m37[6];
    m37[0] = m36[0];
    m37[1] = m36[1];
    m37[2] = m36[2];
    m37[3] = m36[3];
    m37[4] = m36[4];
    m37[5] = m36[5];
    m37[6] = m36[6];
    m36[0] = m35[0];
    m36[1] = m35[1];
    m36[2] = m35[2];
    m36[3] = m35[3];
    m36[4] = m35[4];
    m36[5] = m35[5];
    m36[6] = m35[6];
    m35[0] = m34[0];
    m35[1] = m34[1];
    m35[2] = m34[2];
    m35[3] = m34[3];
    m35[4] = m34[4];
    m35[5] = m34[5];
    m35[6] = m34[6];
    m34[0] = m33[0];
    m34[1] = m33[1];
    m34[2] = m33[2];
    m34[3] = m33[3];
    m34[4] = m33[4];
    m34[5] = m33[5];
    m34[6] = m33[6];
    m33[0] = m32[0];
    m33[1] = m32[1];
    m33[2] = m32[2];
    m33[3] = m32[3];
    m33[4] = m32[4];
    m33[5] = m32[5];
    m33[6] = m32[6];
    m32[0] = m31[0];
    m32[1] = m31[1];
    m32[2] = m31[2];
    m32[3] = m31[3];
    m32[4] = m31[4];
    m32[5] = m31[5];
    m32[6] = m31[6];
    m31[0] = m30[0];
    m31[1] = m30[1];
    m31[2] = m30[2];
    m31[3] = m30[3];
    m31[4] = m30[4];
    m31[5] = m30[5];
    m31[6] = m30[6];
    m30[0] = m29[0];
    m30[1] = m29[1];
    m30[2] = m29[2];
    m30[3] = m29[3];
    m30[4] = m29[4];
    m30[5] = m29[5];
    m30[6] = m29[6];
    m29[0] = m28[0];
    m29[1] = m28[1];
    m29[2] = m28[2];
    m29[3] = m28[3];
    m29[4] = m28[4];
    m29[5] = m28[5];
    m29[6] = m28[6];
    m28[0] = m27[0];
    m28[1] = m27[1];
    m28[2] = m27[2];
    m28[3] = m27[3];
    m28[4] = m27[4];
    m28[5] = m27[5];
    m28[6] = m27[6];
    m27[0] = m26[0];
    m27[1] = m26[1];
    m27[2] = m26[2];
    m27[3] = m26[3];
    m27[4] = m26[4];
    m27[5] = m26[5];
    m27[6] = m26[6];
    m26[0] = m25[0];
    m26[1] = m25[1];
    m26[2] = m25[2];
    m26[3] = m25[3];
    m26[4] = m25[4];
    m26[5] = m25[5];
    m26[6] = m25[6];
    m25[0] = m24[0];
    m25[1] = m24[1];
    m25[2] = m24[2];
    m25[3] = m24[3];
    m25[4] = m24[4];
    m25[5] = m24[5];
    m25[6] = m24[6];
    m24[0] = m23[0];
    m24[1] = m23[1];
    m24[2] = m23[2];
    m24[3] = m23[3];
    m24[4] = m23[4];
    m24[5] = m23[5];
    m24[6] = m23[6];
    m23[0] = m22[0];
    m23[1] = m22[1];
    m23[2] = m22[2];
    m23[3] = m22[3];
    m23[4] = m22[4];
    m23[5] = m22[5];
    m23[6] = m22[6];
    m22[0] = m21[0];
    m22[1] = m21[1];
    m22[2] = m21[2];
    m22[3] = m21[3];
    m22[4] = m21[4];
    m22[5] = m21[5];
    m22[6] = m21[6];
    m21[0] = m20[0];
    m21[1] = m20[1];
    m21[2] = m20[2];
    m21[3] = m20[3];
    m21[4] = m20[4];
    m21[5] = m20[5];
    m21[6] = m20[6];
    m20[0] = m19[0];
    m20[1] = m19[1];
    m20[2] = m19[2];
    m20[3] = m19[3];
    m20[4] = m19[4];
    m20[5] = m19[5];
    m20[6] = m19[6];
    m19[0] = m18[0];
    m19[1] = m18[1];
    m19[2] = m18[2];
    m19[3] = m18[3];
    m19[4] = m18[4];
    m19[5] = m18[5];
    m19[6] = m18[6];
    m18[0] = m17[0];
    m18[1] = m17[1];
    m18[2] = m17[2];
    m18[3] = m17[3];
    m18[4] = m17[4];
    m18[5] = m17[5];
    m18[6] = m17[6];
    m17[0] = m16[0];
    m17[1] = m16[1];
    m17[2] = m16[2];
    m17[3] = m16[3];
    m17[4] = m16[4];
    m17[5] = m16[5];
    m17[6] = m16[6];
    m16[0] = m15[0];
    m16[1] = m15[1];
    m16[2] = m15[2];
    m16[3] = m15[3];
    m16[4] = m15[4];
    m16[5] = m15[5];
    m16[6] = m15[6];
    m15[0] = m14[0];
    m15[1] = m14[1];
    m15[2] = m14[2];
    m15[3] = m14[3];
    m15[4] = m14[4];
    m15[5] = m14[5];
    m15[6] = m14[6];
    m14[0] = m13[0];
    m14[1] = m13[1];
    m14[2] = m13[2];
    m14[3] = m13[3];
    m14[4] = m13[4];
    m14[5] = m13[5];
    m14[6] = m13[6];
    m13[0] = m12[0];
    m13[1] = m12[1];
    m13[2] = m12[2];
    m13[3] = m12[3];
    m13[4] = m12[4];
    m13[5] = m12[5];
    m13[6] = m12[6];
    m12[0] = m11[0];
    m12[1] = m11[1];
    m12[2] = m11[2];
    m12[3] = m11[3];
    m12[4] = m11[4];
    m12[5] = m11[5];
    m12[6] = m11[6];
    m11[0] = m10[0];
    m11[1] = m10[1];
    m11[2] = m10[2];
    m11[3] = m10[3];
    m11[4] = m10[4];
    m11[5] = m10[5];
    m11[6] = m10[6];
    m10[0] = m09[0];
    m10[1] = m09[1];
    m10[2] = m09[2];
    m10[3] = m09[3];
    m10[4] = m09[4];
    m10[5] = m09[5];
    m10[6] = m09[6];
    m09[0] = m08[0];
    m09[1] = m08[1];
    m09[2] = m08[2];
    m09[3] = m08[3];
    m09[4] = m08[4];
    m09[5] = m08[5];
    m09[6] = m08[6];
    m08[0] = m07[0];
    m08[1] = m07[1];
    m08[2] = m07[2];
    m08[3] = m07[3];
    m08[4] = m07[4];
    m08[5] = m07[5];
    m08[6] = m07[6];
    m07[0] = m06[0];
    m07[1] = m06[1];
    m07[2] = m06[2];
    m07[3] = m06[3];
    m07[4] = m06[4];
    m07[5] = m06[5];
    m07[6] = m06[6];
    m06[0] = m05[0];
    m06[1] = m05[1];
    m06[2] = m05[2];
    m06[3] = m05[3];
    m06[4] = m05[4];
    m06[5] = m05[5];
    m06[6] = m05[6];
    m05[0] = m04[0];
    m05[1] = m04[1];
    m05[2] = m04[2];
    m05[3] = m04[3];
    m05[4] = m04[4];
    m05[5] = m04[5];
    m05[6] = m04[6];
    m04[0] = m03[0];
    m04[1] = m03[1];
    m04[2] = m03[2];
    m04[3] = m03[3];
    m04[4] = m03[4];
    m04[5] = m03[5];
    m04[6] = m03[6];
    m03[0] = m02[0];
    m03[1] = m02[1];
    m03[2] = m02[2];
    m03[3] = m02[3];
    m03[4] = m02[4];
    m03[5] = m02[5];
    m03[6] = m02[6];
    m02[0] = m01[0];
    m02[1] = m01[1];
    m02[2] = m01[2];
    m02[3] = m01[3];
    m02[4] = m01[4];
    m02[5] = m01[5];
    m02[6] = m01[6];
    m01[0] = Time.now();
    m01[1] = xmin;
    m01[2] = xmax;
    m01[3] = ymin;
    m01[4] = ymax;
    m01[5] = zmin;
    m01[6] = zmax;

    // {Time.now(), xmin, xmax, ymin, ymax, zmin, zmax};

    // provide access to a single variable, string in JSON format
    // sprintf(json_str, "{\"z\": %u, \"y\": %u, \"x\": %u}", analogval_z, analogval_y, analogval_x);
    sprintf(q1, "%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u", m01[0], m01[1], m01[2], m01[3], m01[4], m01[5], m01[6], m02[0], m02[1], m02[2], m02[3], m02[4], m02[5], m02[6], m03[0], m03[1], m03[2], m03[3], m03[4], m03[5], m03[6], m04[0], m04[1], m04[2], m04[3], m04[4], m04[5], m04[6], m05[0], m05[1], m05[2], m05[3], m05[4], m05[5], m05[6], m06[0], m06[1], m06[2], m06[3], m06[4], m06[5], m06[6], m07[0], m07[1], m07[2], m07[3], m07[4], m07[5], m07[6], m08[0], m08[1], m08[2], m08[3], m08[4], m08[5], m08[6], m09[0], m09[1], m09[2], m09[3], m09[4], m09[5], m09[6], m10[0], m10[1], m10[2], m10[3], m10[4], m10[5], m10[6], m11[0], m11[1], m11[2], m11[3], m11[4], m11[5], m11[6], m12[0], m12[1], m12[2], m12[3], m12[4], m12[5], m12[6], m13[0], m13[1], m13[2], m13[3], m13[4], m13[5], m13[6], m14[0], m14[1], m14[2], m14[3], m14[4], m14[5], m14[6], m15[0], m15[1], m15[2], m15[3], m15[4], m15[5], m15[6]);
    sprintf(q2, "%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u", m16[0], m16[1], m16[2], m16[3], m16[4], m16[5], m16[6], m17[0], m17[1], m17[2], m17[3], m17[4], m17[5], m17[6], m18[0], m18[1], m18[2], m18[3], m18[4], m18[5], m18[6], m19[0], m19[1], m19[2], m19[3], m19[4], m19[5], m19[6], m20[0], m20[1], m20[2], m20[3], m20[4], m20[5], m20[6], m21[0], m21[1], m21[2], m21[3], m21[4], m21[5], m21[6], m22[0], m22[1], m22[2], m22[3], m22[4], m22[5], m22[6], m23[0], m23[1], m23[2], m23[3], m23[4], m23[5], m23[6], m24[0], m24[1], m24[2], m24[3], m24[4], m24[5], m24[6], m25[0], m25[1], m25[2], m25[3], m25[4], m25[5], m25[6], m26[0], m26[1], m26[2], m26[3], m26[4], m26[5], m26[6], m27[0], m27[1], m27[2], m27[3], m27[4], m27[5], m27[6], m28[0], m28[1], m28[2], m28[3], m28[4], m28[5], m28[6], m29[0], m29[1], m29[2], m29[3], m29[4], m29[5], m29[6], m30[0], m30[1], m30[2], m30[3], m30[4], m30[5], m30[6]);
    sprintf(q3, "%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u", m31[0], m31[1], m31[2], m31[3], m31[4], m31[5], m31[6], m32[0], m32[1], m32[2], m32[3], m32[4], m32[5], m32[6], m33[0], m33[1], m33[2], m33[3], m33[4], m33[5], m33[6], m34[0], m34[1], m34[2], m34[3], m34[4], m34[5], m34[6], m35[0], m35[1], m35[2], m35[3], m35[4], m35[5], m35[6], m36[0], m36[1], m36[2], m36[3], m36[4], m36[5], m36[6], m37[0], m37[1], m37[2], m37[3], m37[4], m37[5], m37[6], m38[0], m38[1], m38[2], m38[3], m38[4], m38[5], m38[6], m39[0], m39[1], m39[2], m39[3], m39[4], m39[5], m39[6], m40[0], m40[1], m40[2], m40[3], m40[4], m40[5], m40[6], m41[0], m41[1], m41[2], m41[3], m41[4], m41[5], m41[6], m42[0], m42[1], m42[2], m42[3], m42[4], m42[5], m42[6], m43[0], m43[1], m43[2], m43[3], m43[4], m43[5], m43[6], m44[0], m44[1], m44[2], m44[3], m44[4], m44[5], m44[6], m45[0], m45[1], m45[2], m45[3], m45[4], m45[5], m45[6]);
    sprintf(q4, "%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u,%u %u %u %u %u %u %u", m46[0], m46[1], m46[2], m46[3], m46[4], m46[5], m46[6], m47[0], m47[1], m47[2], m47[3], m47[4], m47[5], m47[6], m48[0], m48[1], m48[2], m48[3], m48[4], m48[5], m48[6], m49[0], m49[1], m49[2], m49[3], m49[4], m49[5], m49[6], m50[0], m50[1], m50[2], m50[3], m50[4], m50[5], m50[6], m51[0], m51[1], m51[2], m51[3], m51[4], m51[5], m51[6], m52[0], m52[1], m52[2], m52[3], m52[4], m52[5], m52[6], m53[0], m53[1], m53[2], m53[3], m53[4], m53[5], m53[6], m54[0], m54[1], m54[2], m54[3], m54[4], m54[5], m54[6], m55[0], m55[1], m55[2], m55[3], m55[4], m55[5], m55[6], m56[0], m56[1], m56[2], m56[3], m56[4], m56[5], m56[6], m57[0], m57[1], m57[2], m57[3], m57[4], m57[5], m57[6], m58[0], m58[1], m58[2], m58[3], m58[4], m58[5], m58[6], m59[0], m59[1], m59[2], m59[3], m59[4], m59[5], m59[6], m60[0], m60[1], m60[2], m60[3], m60[4], m60[5], m60[6]);
  }
}
