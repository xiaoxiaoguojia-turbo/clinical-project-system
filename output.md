==========================================
Clinical Project System - Docker Tool
==========================================

Please select:
[1] First Deploy (Build and Start)
[2] Start Service
[3] Stop Service
[4] Restart Service
[5] View Logs
[6] View Status
[7] Clean All Data (DANGER!)
[0] Exit

Input (0-7): 1

[Step 1/4] Checking environment config...

[Step 2/4] Building Docker images...
[+] Building 23.8s (4/4) FINISHED
 => [internal] load local bake definitions                                                                                                                                              0.0s
 => => reading from stdin 574B                                                                                                                                                          0.0s
 => [internal] load build definition from Dockerfile                                                                                                                                    0.1s
 => => transferring dockerfile: 2.01kB                                                                                                                                                  0.0s
 => ERROR [internal] load metadata for docker.io/library/node:20-alpine                                                                                                                23.3s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                                             0.0s
------
 > [internal] load metadata for docker.io/library/node:20-alpine:
------
Dockerfile:40

--------------------

  38 |

  39 |     # ===== 阶段3: 生产运行 =====

  40 | >>> FROM node:20-alpine AS runner

  41 |

  42 |     WORKDIR /app

--------------------

failed to solve: failed to fetch oauth token: Post "https://auth.docker.io/token": dial tcp 103.214.168.106:443: connectex: A connection attempt failed because the connected party did not p
roperly respond after a period of time, or established connection failed because connected host has failed to respond.



View build details: docker-desktop://dashboard/build/default/default/v87s96hxqgzcb7ghfky1zzrf0


[Step 3/4] Starting services...
[+] Running 1/9
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.3s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.4s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.5s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.6s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.7s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.8s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           5.9s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.0s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.1s
[+] Running 1/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.2s
[+] Running 2/9⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.3s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.4s
[+] Running 2/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.5s
[+] Running 2/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.6s
[+] Running 2/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.7s
[+] Running 2/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.8s
[+] Running 2/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⠀⠀] Pulling                                                                                                                                                           6.9s
[+] Running 3/9485 Download complete                                                                                                                                                     1.6s
 - mongodb [⣿⣿⠀⠀⠀⠀⣿⠀] Pulling                                                                                                                                                           7.0s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
[+] Running 3/98b Pulling fs layer                                                                                                                                                      2.1s
 - mongodb [⣿⣿⠀⠀⠀⠀⣿⠀] Pulling                                                                                                                                                           7.1s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
[+] Running 3/911 Pulling fs layer                                                                                                                                                      2.3s
 - mongodb [⣿⣿⠀⠀⠀⠀⣿⠀] Pulling                                                                                                                                                           7.2s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
[+] Running 3/911 Pulling fs layer                                                                                                                                                      2.4s
 - mongodb [⣿⣿⠀⠀⠀⠀⣿⠀] Pulling                                                                                                                                                           7.3s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
[+] Running 4/911 Pulling fs layer                                                                                                                                                      2.5s
 - mongodb [⣿⣿⠀⠀⠀⣿⣿⠀] Pulling                                                                                                                                                           7.4s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - d91d51de2f11 Pulling fs layer                                                                                                                                                      2.6s
[+] Running 4/95f7 Download complete                                                                                                                                                     0.5s
 - mongodb [⣿⣿⠀⠀⠀⣿⣿⠀] Pulling                                                                                                                                                           7.5s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      2.7s
[+] Running 4/95f7 Download complete                                                                                                                                                     0.5s
 - mongodb [⣿⣿⠀⠀⡀⣿⣿⠀] Pulling                                                                                                                                                           7.6s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      2.8s
[+] Running 4/95f7 Download complete                                                                                                                                                     0.5s
 - mongodb [⣿⣿⠀⠀⡀⣿⣿⠀] Pulling                                                                                                                                                           7.7s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      2.9s
[+] Running 5/95f7 Download complete                                                                                                                                                     0.5s
 - mongodb [⣿⣿⣿⠀⡀⣿⣿⠀] Pulling                                                                                                                                                           7.8s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      3.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⡀⣿⣿⠀] Pulling                                                                                                                                                           7.9s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      3.1s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣀⣿⣿⠀] Pulling                                                                                                                                                           8.0s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      3.2s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣀⣿⣿⠀] Pulling                                                                                                                                                           8.1s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Pulling fs layer                                                                                                                                                      3.3s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣄⣿⣿⠀] Pulling                                                                                                                                                           8.2s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Downloading    [>                                                  ]  1.049MB/247.8MB                                                                                 3.4s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣄⣿⣿⠀] Pulling                                                                                                                                                           8.3s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Downloading    [>                                                  ]  1.049MB/247.8MB                                                                                 3.5s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 5/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣄⣿⣿⣦] 17.83MB / 278.9MB Pulling                                                                                                                                         8.4s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Downloading    [>                                                  ]  1.049MB/247.8MB                                                                                 3.6s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
[+] Running 6/991f Download complete                                                                                                                                                     2.6s
 - mongodb [⣿⣿⣿⠀⣤⣿⣿⣿] 19.92MB / 278.9MB Pulling                                                                                                                                         8.5s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - 907d967ea28b Downloading   [>                                                  ]  2.097MB/247.8MB                                                                                  3.7s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣤⣿⣿⣿] 23.07MB / 278.9MB Pulling                                                                                                                                         8.6s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [==========================>                        ]  15.73MB/29.54MB                                                                                3.8s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣦⣿⣿⣿] 25.17MB / 278.9MB Pulling                                                                                                                                         8.7s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [==============================>                    ]  17.83MB/29.54MB                                                                                3.9s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣦⣿⣿⣿] 27.26MB / 278.9MB Pulling                                                                                                                                         8.8s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [===============================>                   ]  18.87MB/29.54MB                                                                                4.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣦⣿⣿⣿] 29.36MB / 278.9MB Pulling                                                                                                                                         8.9s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [=================================>                 ]  19.92MB/29.54MB                                                                                4.1s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣦⣿⣿⣿] 31.46MB / 278.9MB Pulling                                                                                                                                         9.0s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [===================================>               ]  20.97MB/29.54MB                                                                                4.2s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣶⣿⣿⣿] 33.55MB / 278.9MB Pulling                                                                                                                                         9.1s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [=====================================>             ]  22.02MB/29.54MB                                                                                4.3s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣶⣿⣿⣿] 35.65MB / 278.9MB Pulling                                                                                                                                         9.2s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [=======================================>           ]  23.07MB/29.54MB                                                                                4.4s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣶⣿⣿⣿] 39.42MB / 278.9MB Pulling                                                                                                                                         9.3s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [========================================>          ]  24.12MB/29.54MB                                                                                4.5s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣷⣿⣿⣿] 41.94MB / 278.9MB Pulling                                                                                                                                         9.4s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [===========================================>       ]  25.79MB/29.54MB                                                                                4.6s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣷⣿⣿⣿] 44.04MB / 278.9MB Pulling                                                                                                                                         9.5s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [==============================================>    ]  27.26MB/29.54MB                                                                                4.7s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 46.14MB / 278.9MB Pulling                                                                                                                                         9.6s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Downloading     [===============================================>   ]  28.31MB/29.54MB                                                                                4.8s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 47.19MB / 278.9MB Pulling                                                                                                                                         9.7s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   4.9s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 48.23MB / 278.9MB Pulling                                                                                                                                         9.8s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 49.28MB / 278.9MB Pulling                                                                                                                                         9.9s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.1s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 50.33MB / 278.9MB Pulling                                                                                                                                        10.0s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.2s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 51.38MB / 278.9MB Pulling                                                                                                                                        10.1s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.3s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 53.48MB / 278.9MB Pulling                                                                                                                                        10.2s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.4s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 54.53MB / 278.9MB Pulling                                                                                                                                        10.3s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.5s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 55.57MB / 278.9MB Pulling                                                                                                                                        10.4s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.6s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 55.57MB / 278.9MB Pulling                                                                                                                                        10.5s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.7s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 57.67MB / 278.9MB Pulling                                                                                                                                        10.6s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      1 s                                                                                                                                                   5.8s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 58.72MB / 278.9MB Pulling                                                                                                                                        10.7s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   5.9s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⠀⣿⣿⣿⣿] 60.82MB / 278.9MB Pulling                                                                                                                                        10.8s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 62.91MB / 278.9MB Pulling                                                                                                                                        10.9s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.1s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 65.01MB / 278.9MB Pulling                                                                                                                                        11.0s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.2s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 66.06MB / 278.9MB Pulling                                                                                                                                        11.1s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.3s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 67.11MB / 278.9MB Pulling                                                                                                                                        11.2s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.4s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 69.21MB / 278.9MB Pulling                                                                                                                                        11.3s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.5s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 70.36MB / 278.9MB Pulling                                                                                                                                        11.4s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.6s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 72.35MB / 278.9MB Pulling                                                                                                                                        11.5s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.7s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 72.35MB / 278.9MB Pulling                                                                                                                                        11.6s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.8s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 72.35MB / 278.9MB Pulling                                                                                                                                        11.7s
   ✔ 9d9d86f60485 Download complete                                                                                                                                                     1.6s
   - af6eca94c810 Extracting      2 s                                                                                                                                                   6.9s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] Pulling                                                                                                                                                          11.8s
   - 9d9d86f60485 Extracting      1 s                                                                                                                                                   7.1s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
   ✔ d91d51de2f11 Download complete                                                                                                                                                     3.0s
[+] Running 6/94eb Download complete                                                                                                                                                     2.2s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿]  75.5MB / 278.9MB Pulling                                                                                                                                        11.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s

[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 76.55MB / 278.9MB Pulling                                                                                                                                        12.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s
   ✔ af6eca94c810 Pull complete                                                                                                                                                         7.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
[+] Running 6/9f11 Download complete                                                                                                                                                     3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] Pulling                                                                                                                                                          12.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s
   ✔ af6eca94c810 Pull complete                                                                                                                                                         7.0s
   ✔ 4e898e1375f7 Download complete                                                                                                                                                     0.5s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
[+] Running 7/9f11 Pull complete                                                                                                                                                         3.0s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 79.69MB / 278.9MB Pulling                                                                                                                                        12.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s
   ✔ af6eca94c810 Pull complete                                                                                                                                                         7.0s
   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9eb Extracting  1 s                                                                                                                                                       7.4s
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 80.74MB / 278.9MB Pulling                                                                                                                                        12.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 82.84MB / 278.9MB Pulling                                                                                                                                        12.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 83.89MB / 278.9MB Pulling                                                                                                                                        12.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 85.98MB / 278.9MB Pulling                                                                                                                                        12.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 87.03MB / 278.9MB Pulling                                                                                                                                        12.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 88.08MB / 278.9MB Pulling                                                                                                                                        12.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 89.13MB / 278.9MB Pulling                                                                                                                                        12.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⡀⣿⣿⣿⣿] 91.23MB / 278.9MB Pulling                                                                                                                                        13.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 92.27MB / 278.9MB Pulling                                                                                                                                        13.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 93.32MB / 278.9MB Pulling                                                                                                                                        13.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 95.42MB / 278.9MB Pulling                                                                                                                                        13.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 96.47MB / 278.9MB Pulling                                                                                                                                        13.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 98.57MB / 278.9MB Pulling                                                                                                                                        13.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 99.61MB / 278.9MB Pulling                                                                                                                                        13.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 100.7MB / 278.9MB Pulling                                                                                                                                        13.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 101.7MB / 278.9MB Pulling                                                                                                                                        13.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 102.8MB / 278.9MB Pulling                                                                                                                                        13.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 104.9MB / 278.9MB Pulling                                                                                                                                        14.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 105.9MB / 278.9MB Pulling                                                                                                                                        14.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿]   107MB / 278.9MB Pulling                                                                                                                                        14.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 109.1MB / 278.9MB Pulling                                                                                                                                        14.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 110.1MB / 278.9MB Pulling                                                                                                                                        14.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 111.1MB / 278.9MB Pulling                                                                                                                                        14.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 112.2MB / 278.9MB Pulling                                                                                                                                        14.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 114.3MB / 278.9MB Pulling                                                                                                                                        14.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 115.3MB / 278.9MB Pulling                                                                                                                                        14.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 117.4MB / 278.9MB Pulling                                                                                                                                        14.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 118.5MB / 278.9MB Pulling                                                                                                                                        15.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 119.5MB / 278.9MB Pulling                                                                                                                                        15.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 120.6MB / 278.9MB Pulling                                                                                                                                        15.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣀⣿⣿⣿⣿] 122.7MB / 278.9MB Pulling                                                                                                                                        15.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 123.7MB / 278.9MB Pulling                                                                                                                                        15.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 125.8MB / 278.9MB Pulling                                                                                                                                        15.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 126.9MB / 278.9MB Pulling                                                                                                                                        15.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 127.9MB / 278.9MB Pulling                                                                                                                                        15.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿]   130MB / 278.9MB Pulling                                                                                                                                        15.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 131.1MB / 278.9MB Pulling                                                                                                                                        15.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 132.5MB / 278.9MB Pulling                                                                                                                                        16.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 133.2MB / 278.9MB Pulling                                                                                                                                        16.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 135.3MB / 278.9MB Pulling                                                                                                                                        16.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 136.3MB / 278.9MB Pulling                                                                                                                                        16.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 138.4MB / 278.9MB Pulling                                                                                                                                        16.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 139.5MB / 278.9MB Pulling                                                                                                                                        16.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 140.5MB / 278.9MB Pulling                                                                                                                                        16.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 142.6MB / 278.9MB Pulling                                                                                                                                        16.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 143.7MB / 278.9MB Pulling                                                                                                                                        16.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 144.7MB / 278.9MB Pulling                                                                                                                                        16.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 146.8MB / 278.9MB Pulling                                                                                                                                        17.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 147.8MB / 278.9MB Pulling                                                                                                                                        17.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 148.9MB / 278.9MB Pulling                                                                                                                                        17.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 149.9MB / 278.9MB Pulling                                                                                                                                        17.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿]   152MB / 278.9MB Pulling                                                                                                                                        17.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣄⣿⣿⣿⣿] 153.1MB / 278.9MB Pulling                                                                                                                                        17.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 154.1MB / 278.9MB Pulling                                                                                                                                        17.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 156.2MB / 278.9MB Pulling                                                                                                                                        17.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 157.3MB / 278.9MB Pulling                                                                                                                                        17.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 159.4MB / 278.9MB Pulling                                                                                                                                        17.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 160.4MB / 278.9MB Pulling                                                                                                                                        18.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 161.5MB / 278.9MB Pulling                                                                                                                                        18.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 163.6MB / 278.9MB Pulling                                                                                                                                        18.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 164.6MB / 278.9MB Pulling                                                                                                                                        18.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 166.7MB / 278.9MB Pulling                                                                                                                                        18.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 167.8MB / 278.9MB Pulling                                                                                                                                        18.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 168.8MB / 278.9MB Pulling                                                                                                                                        18.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 170.9MB / 278.9MB Pulling                                                                                                                                        18.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿]   172MB / 278.9MB Pulling                                                                                                                                        18.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿]   173MB / 278.9MB Pulling                                                                                                                                        18.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 174.1MB / 278.9MB Pulling                                                                                                                                        19.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 176.2MB / 278.9MB Pulling                                                                                                                                        19.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 177.2MB / 278.9MB Pulling                                                                                                                                        19.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 179.3MB / 278.9MB Pulling                                                                                                                                        19.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 180.4MB / 278.9MB Pulling                                                                                                                                        19.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 182.5MB / 278.9MB Pulling                                                                                                                                        19.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 183.5MB / 278.9MB Pulling                                                                                                                                        19.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣤⣿⣿⣿⣿] 184.5MB / 278.9MB Pulling                                                                                                                                        19.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 185.6MB / 278.9MB Pulling                                                                                                                                        19.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 186.6MB / 278.9MB Pulling                                                                                                                                        19.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 187.7MB / 278.9MB Pulling                                                                                                                                        20.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 189.8MB / 278.9MB Pulling                                                                                                                                        20.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 190.8MB / 278.9MB Pulling                                                                                                                                        20.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 191.9MB / 278.9MB Pulling                                                                                                                                        20.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿]   194MB / 278.9MB Pulling                                                                                                                                        20.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿]   195MB / 278.9MB Pulling                                                                                                                                        20.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 196.1MB / 278.9MB Pulling                                                                                                                                        20.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 198.2MB / 278.9MB Pulling                                                                                                                                        20.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 199.2MB / 278.9MB Pulling                                                                                                                                        20.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 201.3MB / 278.9MB Pulling                                                                                                                                        20.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 202.4MB / 278.9MB Pulling                                                                                                                                        21.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 203.4MB / 278.9MB Pulling                                                                                                                                        21.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 205.5MB / 278.9MB Pulling                                                                                                                                        21.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 206.6MB / 278.9MB Pulling                                                                                                                                        21.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 207.6MB / 278.9MB Pulling                                                                                                                                        21.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 209.7MB / 278.9MB Pulling                                                                                                                                        21.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 210.8MB / 278.9MB Pulling                                                                                                                                        21.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 211.8MB / 278.9MB Pulling                                                                                                                                        21.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 213.9MB / 278.9MB Pulling                                                                                                                                        21.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣦⣿⣿⣿⣿] 213.9MB / 278.9MB Pulling                                                                                                                                        21.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿]   216MB / 278.9MB Pulling                                                                                                                                        22.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 217.1MB / 278.9MB Pulling                                                                                                                                        22.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 218.1MB / 278.9MB Pulling                                                                                                                                        22.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 220.2MB / 278.9MB Pulling                                                                                                                                        22.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 221.2MB / 278.9MB Pulling                                                                                                                                        22.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 222.3MB / 278.9MB Pulling                                                                                                                                        22.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 224.4MB / 278.9MB Pulling                                                                                                                                        22.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 225.4MB / 278.9MB Pulling                                                                                                                                        22.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 227.5MB / 278.9MB Pulling                                                                                                                                        22.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 228.6MB / 278.9MB Pulling                                                                                                                                        22.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 229.6MB / 278.9MB Pulling                                                                                                                                        23.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 231.7MB / 278.9MB Pulling                                                                                                                                        23.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 232.8MB / 278.9MB Pulling                                                                                                                                        23.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 234.9MB / 278.9MB Pulling                                                                                                                                        23.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 235.9MB / 278.9MB Pulling                                                                                                                                        23.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿]   237MB / 278.9MB Pulling                                                                                                                                        23.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 239.1MB / 278.9MB Pulling                                                                                                                                        23.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 240.1MB / 278.9MB Pulling                                                                                                                                        23.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 241.2MB / 278.9MB Pulling                                                                                                                                        23.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 243.3MB / 278.9MB Pulling                                                                                                                                        23.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 244.3MB / 278.9MB Pulling                                                                                                                                        24.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣶⣿⣿⣿⣿] 245.4MB / 278.9MB Pulling                                                                                                                                        24.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 247.5MB / 278.9MB Pulling                                                                                                                                        24.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 248.5MB / 278.9MB Pulling                                                                                                                                        24.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 250.6MB / 278.9MB Pulling                                                                                                                                        24.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 251.7MB / 278.9MB Pulling                                                                                                                                        24.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 252.7MB / 278.9MB Pulling                                                                                                                                        24.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 254.8MB / 278.9MB Pulling                                                                                                                                        24.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 255.9MB / 278.9MB Pulling                                                                                                                                        24.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 257.9MB / 278.9MB Pulling                                                                                                                                        24.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿]   259MB / 278.9MB Pulling                                                                                                                                        25.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿]   260MB / 278.9MB Pulling                                                                                                                                        25.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 262.1MB / 278.9MB Pulling                                                                                                                                        25.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 263.2MB / 278.9MB Pulling                                                                                                                                        25.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 265.3MB / 278.9MB Pulling                                                                                                                                        25.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 266.3MB / 278.9MB Pulling                                                                                                                                        25.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 267.4MB / 278.9MB Pulling                                                                                                                                        25.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 268.4MB / 278.9MB Pulling                                                                                                                                        25.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 269.5MB / 278.9MB Pulling                                                                                                                                        25.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 269.5MB / 278.9MB Pulling                                                                                                                                        25.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 271.6MB / 278.9MB Pulling                                                                                                                                        26.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 272.6MB / 278.9MB Pulling                                                                                                                                        26.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 273.7MB / 278.9MB Pulling                                                                                                                                        26.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 275.8MB / 278.9MB Pulling                                                                                                                                        26.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣷⣿⣿⣿⣿] 276.8MB / 278.9MB Pulling                                                                                                                                        26.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        26.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        26.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        26.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        26.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        26.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        27.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        28.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        29.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        30.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.2s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.3s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.4s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.5s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.6s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.7s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.8s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        31.9s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        32.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 7/9
 - mongodb [⣿⣿⣿⣿⣿⣿⣿⣿] 277.2MB / 278.9MB Pulling                                                                                                                                        32.1s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s

   ✔ 4e898e1375f7 Pull complete                                                                                                                                                         0.5s

   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
[+] Running 9/9
 ✔ mongodb Pulled                                                                                                                                                                      32.2s
   ✔ af6eca94c810 Pull complete                                                                                                                                                         7.0s
   ✔ 9d9d86f60485 Pull complete                                                                                                                                                         7.1s
   ✔ f8a6564ff91f Download complete                                                                                                                                                     2.6s
[+] Building 21.4s (4/4) FINISHED
 => [internal] load local bake definitions                                                                                                                                              0.0ss
 => => reading from stdin 574B                                                                                                                                                          0.0ss
 => [internal] load build definition from Dockerfile                                                                                                                                    0.0ss
 => => transferring dockerfile: 2.01kB                                                                                                                                                  0.0ss
 => ERROR [internal] load metadata for docker.io/library/node:20-alpine                                                                                                                21.1ss
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                                             0.0ss
------9d9d86f60485 Pull complete                                                                                                                                                         7.1s
 > [internal] load metadata for docker.io/library/node:20-alpine:                                                                                                                        2.6s
------4e898e1375f7 Pull complete                                                                                                                                                         0.5s
Dockerfile:408a4eb Pull complete                                                                                                                                                         7.4s
   ✔ d91d51de2f11 Pull complete                                                                                                                                                         3.0s
--------------------ull complete                                                                                                                                                         7.3s
   ✔ 907d967ea28b Pull complete                                                                                                                                                        27.4s
  38 |
   ✔ af6eca94c810 Pull complete                                                                                                                                                         7.0s
  39 |     # ===== 阶段3: 生产运行 =====
   ✔ f8a6564ff91f Pull complete                                                                                                                                                         2.6s
  40 | >>> FROM node:20-alpine AS runner
   ✔ 02613098a4eb Pull complete                                                                                                                                                         7.4s
  41 |
   ✔ 0f1c32d68638 Pull complete                                                                                                                                                         7.3s
  42 |     WORKDIR /app
[+] Building 13.2s (3/4)
--------------------local bake definitions                                                                                                                                              0.0s
 => => reading from stdin 574B                                                                                                                                                          0.0s
failed to solve: failed to fetch oauth token: Post "https://auth.docker.io/token": dial tcp 103.214.168.106:443: connectex: A connection attempt failed because the connected party did not p
roperly respond after a period of time, or established connection failed because connected host has failed to respond.                                                                  0.0s
 => [internal] load metadata for docker.io/library/node:20-alpine                                                                                                                      12.9s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                                             0.0s

View build details: docker-desktop://dashboard/build/default/default/eeqjq1mzus188x8k6siy667ve


[Step 4/4] Waiting for services...

==========================================
Deployment Complete!
==========================================
Access: http://localhost:3000
Health: http://localhost:3000/api/health
==========================================

Press any key to continue . . .