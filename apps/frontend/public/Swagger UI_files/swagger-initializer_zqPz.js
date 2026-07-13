window.onload = function () {
    function waitForElement(selector) {
      return new Promise(resolve => {
          if (document.querySelector(selector)) {
              return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
              if (document.querySelector(selector)) {
                  observer.disconnect();
                  resolve(document.querySelector(selector));
              }
          });

          // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
    }
    function resolveUrl(url) {
      let currentHref = window.location.href;
      currentHref = currentHref.split('#', 1)[0];
      currentHref = currentHref.endsWith('/') ? currentHref : currentHref + '/';
      const anchor = document.createElement('a');
      anchor.href = currentHref + url;
      return anchor.href
    }

    const config = {}
    const resConfig = Object.assign({}, {
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout",
      validatorUrl: null,
    }, config, {
      url: resolveUrl('./json'),
      oauth2RedirectUrl: resolveUrl('./static/oauth2-redirect.html')
    });

    const ui = SwaggerUIBundle(resConfig)

    
    if (resConfig.layout === 'StandaloneLayout') {
      // Replace the logo
      waitForElement('#swagger-ui > section > div.topbar > div > div > a').then((link) => {
        const img = document.createElement('img')
        img.height = 40
        img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NzQ3IDIwNzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDY3NDcgMjA3MTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjYwMy40LDMzMS43TDY3MDAsODEuNWwtNC4yLTE1LjVsLTk1NS43LDI1MS44QzU4NDIsMTcwLjQsNTgwNyw1Mi4yLDU4MDcsNTIuMlM1NTAxLjgsMjQ3LjEsNTI3MSwyNDIKCWMtMjMwLjgtNS4xLTMwNS4yLTY2LjctNjU5LjEsNDYuMmMtMzUzLjksMTEyLjgtNDUzLjksNDU5LjEtNTU2LjUsNTMzLjVzLTQyNC41LDMxNi43LTQyNC41LDMxNi43bDAuNyw0LjNsMjkwLjItOTIuNAoJYzAsMC03OS42LDc1LTI0OC43LDMwMi45YzAsMC0yLjktMi43LTcuOS03LjNsMC4zLDEuNmMwLDAsMTM1LjksMjA3LjcsMjY5LjMsMTY5LjNjMTMuNC0zLjksMjguNS0xMC4zLDQ1LTE4LjcKCWM1My43LDI5LjksMTIzLjgsNTkuMywyMDEuMiw2Ny40YzAsMC01Mi40LTYwLjktOTYuMS0xMzAuMmMxMS44LTcuNiwyMy45LTE1LjUsMzYuMi0yMy41bC01LjcsNGwxMTAuNSw0MC42bC0xMi4yLTEwMy45CgljMC40LTAuMiwwLjctMC41LDEuMS0wLjdsMTA4LjYsMzkuOWwtMTMuNS05NC41YzEzLjgtNy4yLDI3LjUtMTQsNDEuMi0yMC4zbDExMy4yLTQyOC4ybDQ2OC4xLTMxOS4zbC0zNy4yLDkzLjYKCWMtOTQuOSwyMzMuNC0yNzMuMSwyODguNS0yNzMuMSwyODguNWwtNzQuNCwyOC4yYy01NS4zLDY1LjQtNzguNiw4MS41LTk3LjYsMzAxYzQ0LjYtMTEuMiw4Ny4yLTEzLjksMTI1LjgtMy41CgljMjAwLDUzLjksMjY5LjMsMjk0LjksMjE1LjQsMzYxLjZjLTEzLjUsMTYuNy00NS42LDQ1LjItODYuMSw3OC43aC04MS4ybC0xLjEsNjUuOGMtMi44LDIuMi01LjYsNC4zLTguMyw2LjVoLTgyLjZsLTEsNjQuMgoJYy03LjMsNS42LTE0LjYsMTEtMjEuNiwxNi4zYy03Ny42LDEuNi0xNzUuOS02Ni4xLTE3NS45LTY2LjFjMCw2MS42LDUxLjMsMTU2LjQsNTEuMywxNTYuNHMzLjQtMS42LDkuMS00LjRjLTUsMy43LTcuOCw1LjctNy44LDUuNwoJczIwNy43LDEzOC41LDMzOC41LDg3LjJjMTE2LjMtNDUuNiw0MTcuNC0yODMsNjc3LjMtMzk1LjRsNzg2LjUtMjA3LjJsMTAzLjctMjY4LjdsLTU5OS40LDE1Ny45di0yNDEuM0w2Mzk2LDg2OS4xbDEwMy43LTI2OC43CglMNTY5Mi45LDgxM1Y1NzEuNkw2NjAzLjQsMzMxLjd6IE01MTc2LDg0My4ybDE4Ni42LTQ5LjJsMi41LDkuM2wtNTguMiwxNTAuOGwtMTkzLjQsNTFMNTE3Niw4NDMuMnogTTUyNDAuNCwxMTY2bC0xOTMuNCw1MQoJbDYyLjUtMTYybDE4Ni42LTQ5LjJsMi41LDkuM0w1MjQwLjQsMTE2NnogTTU0OTIuNCwxMTExLjlsLTE5My40LDUxbDYyLjUtMTYybDE4Ni42LTQ5LjJsMi41LDkuM0w1NDkyLjQsMTExMS45eiIvPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODYuNyw2NTYuNWw2LjEtMzAuOGMxNy04OS4zLDUwLjktMTY2LjQsMTE0LTIyNC45YzQ2LjItNDMuMSwxMTQtNjkuMywxOTEtNjkuM2M0OS4zLDAsODYuMyw3LjcsMTA5LjQsMTUuNAoJCWwtNDMuMSwxNDcuOWMtMTguNS02LjItMzUuNC05LjItNjAuMS05LjJjLTY5LjMsMC0xMDkuNCw3Mi40LTEyMS43LDEzOC42bC02LjIsMzIuM2gxNDYuNGwtMjYuMiwxMzUuNkgzNTNsLTExOC42LDYxNy44SDQxLjgKCQlsMTE4LjYtNjE3LjgiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04MTYuOCwxNDA5LjljMS41LTQwLDQuNi04MS43LDYuMS0xMjYuM2gtNC42Yy02MC4xLDEwMC4yLTEzMi41LDEzOC43LTE5Mi42LDEzOC43CgkJYy0xMDkuNCwwLTE2My4zLTk0LTE2My4zLTIyNi41YzAtMjI4LDExNC01NTEuNSw0MzcuNS01NTEuNWM3NS41LDAsMTUxLDEyLjMsMTk3LjIsMzAuOEwxMDE0LDEwOTQKCQljLTE4LjUsODcuOC0zMi40LDIzNC4yLTMwLjgsMzE1LjhIODE2Ljh6IE04ODYuMSw3OTIuMWMtMTUuNC0zLjEtMjkuMy00LjYtNDAtNC42Yy0xMjYuMywwLTE5NC4xLDI1MS4xLTE5NS43LDM2Mi4xCgkJYzAsNjYuMyw5LjMsMTE0LDU3LDExNGM1Mi40LDAsMTAxLjctODYuMywxMjkuNC0yMjMuNEw4ODYuMSw3OTIuMXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMTIwLjMsMTI0NWMzMC44LDE3LDY3LjgsMzIuMywxMjEuNywzMC44YzU1LjUtMS41LDg2LjMtMzcsODYuMy04NC43YzAtNDEuNi0yMC03MC45LTcyLjQtMTEyLjUKCQljLTY0LjctNTIuNC05NS41LTExOC42LTk1LjUtMTgzLjNjMC0xMzguNywxMDcuOC0yNTEuMSwyNzguOS0yNTEuMWM2Ni4zLDAsMTE0LDEyLjMsMTQxLjcsMjcuN2wtNDEuNiwxNDAuMgoJCWMtMjEuNi0xMi4zLTU3LTIzLjEtODkuMy0yMy4xYy02MS42LDAtMTAwLjEsMzIuMy0xMDAuMSw4My4yYzAsMzguNSwyMS42LDYxLjYsNTcsOTAuOWM4NC43LDY0LjcsMTEyLjUsMTM4LjYsMTEyLjUsMTk3LjIKCQljMCwxNjYuNC0xMTUuNiwyNTguOC0yODguMSwyNTguOGMtNjkuMywwLTEzMS0yMC0xNTcuMi0zOC41TDExMjAuMywxMjQ1eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5NzAuNyw0NTMuMWwtMzguNSwyMDMuNGgyOTUuOGwtMjQuNywxMzUuNkgxOTA2bC02Ni4zLDM0OS43Yy00LjYsMjYuMi02LjIsNDkuMy02LjIsNjMuMgoJCWMwLDQ2LjIsMjMuMSw2My4yLDU4LjYsNjMuMmMxMy45LDAsMzMuOSwwLDUyLjQtMy4xbC0yMy4xLDE0NC44Yy0zNS40LDkuMy03OC42LDEyLjMtMTE1LjYsMTIuM2MtMTE1LjUsMC0xNzIuNi02NC43LTE3Mi42LTE2Ni40CgkJYzAtMzMuOSw2LjItNzUuNSwxMy45LTExMi41bDY2LjMtMzUxLjNoLTg3LjhsMjYuMi0xMzUuNmg4Ny44bDMwLjgtMTU1LjZMMTk3MC43LDQ1My4xeiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIwMTcsMTQwOS45bDE0NC44LTc1My40aDE5Mi42bC0xNDQuOCw3NTMuNEgyMDE3eiBNMjE5Ny4yLDQ2My45YzAtNTUuNCw0MC0xMTguNiwxMDcuOC0xMTguNgoJCWM2My4yLDAsOTIuNSw0Ny43LDkwLjksMTAwLjFjLTEuNSw3Ny01My45LDEyMC4yLTExMC45LDEyMC4yQzIyMjMuNCw1NjUuNiwyMTk1LjcsNTIwLjksMjE5Ny4yLDQ2My45eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTI0NzQsNjU2LjVsNi4xLTMwLjhjMTctODkuMyw1MC45LTE2Ni40LDExNC0yMjQuOWM0Ni4yLTQzLjEsMTE0LTY5LjMsMTkxLTY5LjNjNDkuMywwLDg2LjMsNy43LDEwOS40LDE1LjQKCQlsLTQzLjEsMTQ3LjljLTE4LjUtNi4yLTM1LjQtOS4yLTYwLjEtOS4yYy02OS4zLDAtMTA5LjQsNzIuNC0xMjEuNywxMzguNmwtNi4yLDMyLjNoMjIzLjRsLTI2LjIsMTM1LjZoLTIyMC4zbC0xMTguNiw2MTcuOGgtMTkyLjYKCQlsMTE4LjYtNjE3LjgiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMDA3LjEsNjU2LjVsNC42LDM2Mi4xYzEuNSw3MC45LDMuMSwxMjMuMywxLjUsMTc4LjdoMy4xYzE1LjQtNjEuNiwzMC44LTExMi41LDU3LTE5Mi42bDExNC0zNDguMmgxOTQuMQoJCUwzMTM1LDEyNDkuNmMtNzQsMTcyLjYtMTU4LjcsMzE3LjQtMjUxLjEsNDAyLjFjLTQ0LjcsNDEuNi05Nyw3NC0xMjkuNCw4Ny44bC03Ny0xNTcuMmMzMy45LTE3LDY5LjMtMzcsMTAwLjEtNjEuNgoJCWM0My4yLTM1LjUsODQuNy03OC42LDEwMy4yLTEyMC4yYzMuMS0xMC44LDYuMS0xOC41LDQuNi0zMy45bC04MC4xLTcxMC4zSDMwMDcuMXoiLz4KPC9nPgo8L3N2Zz4K'
        img.href = resolveUrl('/')
        
        link.innerHTML = ''
        link.appendChild(img)
      })
    }

    ui.initOAuth({})
  }