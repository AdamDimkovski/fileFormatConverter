<script lang="ts">

/// <reference types="@types/google.picker" />

  import { onMount } from 'svelte';

  import optionIcon from '$lib/assets/OptionIcon.svg';
  import googleDrive from '$lib/assets/googleDriveIcon.png';
  import oneDrive from '$lib/assets/oneDriveIcon.png';
  import dropboxIcon from '$lib/assets/dropboxIcon.svg';
  import urlIcon from '$lib/assets/urlIcon.png';
  import fileUpload from '$lib/assets/fileUpload.svg';

  interface DropdownItem {
    id: string | number;
    name: string;
    img: string | null;
  }

  const items: DropdownItem[] = [
    { id: 'DeviceUpload', name: 'Upload From Device', img: fileUpload },
    { id: 'GoogleDrive', name: 'Google Drive', img: googleDrive },
    { id: 'OneDrive', name: 'One Drive', img: oneDrive },
    { id: 'Dropbox', name: 'Drop Box', img: dropboxIcon },
    { id: 'URL', name: 'URL', img: urlIcon }
  ];

  const conversionTargets = ['JPG', 'PNG', 'PDF', 'DOCX', 'TXT'];

  let isOpen = $state(false);
  let mode = $state('UploadOptions');
  let selectedItem = $state<DropdownItem>({ id: 'UploadOptions', name: 'Upload Options:', img: optionIcon });
  let selectedFile = $state<File | null>(null);
  let hiddenFileInput = $state<HTMLInputElement | null>(null);
  let selectedConversion = $state(conversionTargets[0]);

  let clientID = '913788147767-b48d86r2anhp6tofuvfuluad81n38kho.apps.googleusercontent.com';
  let apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  let accessToken = $state('');
  let tokenClient: any = $state(null);
  let pickerApiLoaded = $state(false);

  function initGoogleTokenClient() {
    if (!window.google?.accounts?.oauth2?.initTokenClient) return;

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientID,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (res: any) => {
        if (res.error || !res.access_token) {
          console.error('Authentication failed or cancelled:', res.error);
          return;
        }

        const hasScope = window.google.accounts.oauth2.hasGrantedAllScopes(
          res,
          'https://www.googleapis.com/auth/drive.readonly'
        );

        if (!hasScope) {
          console.warn('User did not grant Drive permissions.');
          return;
        }

        accessToken = res.access_token;
        openDrivePicker(); // open picker immediately after auth
      }
    });
  }

  function loadGoogleScript() {
    if (window.google?.accounts?.oauth2?.initTokenClient) {
      initGoogleTokenClient();
    } else {
      const gsi = document.createElement('script');
      gsi.src = 'https://accounts.google.com/gsi/client';
      gsi.async = true;
      gsi.defer = true;
      gsi.onload = initGoogleTokenClient;
      document.head.appendChild(gsi);
    }

    // Load the Picker API
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      gapi.load('picker', () => {
        pickerApiLoaded = true;
      });
    };
    document.head.appendChild(gapiScript);
  }

  onMount(() => {
    loadGoogleScript();
  });

  function openDrivePicker() {
    if (!pickerApiLoaded) return alert('Google Picker is not ready yet.');

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .setCallback((data: any) => {
        if (data.action !== google.picker.Action.PICKED) return;
        const fileId = data.docs[0].id;
        fetchGoogleDriveFile(fileId);
      })
      .build();

    picker.setVisible(true);
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectUploadSource(item: DropdownItem) {
    isOpen = false;
    selectedItem = item;

    if (item.id === 'DeviceUpload') {
      hiddenFileInput?.click();
      return;
    }

    if (item.id === 'GoogleDrive') {
      if (!tokenClient) return alert('Google auth is not ready yet.');

      if (!accessToken) {
        tokenClient.requestAccessToken(); // triggers OAuth popup; callback calls openDrivePicker
        return;
      }

      openDrivePicker(); // already authed, open picker directly
      return;
    }

    alert(`${item.id} is not implemented yet.`);
  }

  async function fetchGoogleDriveFile(fileId: string) {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`,
      { headers }
    );

    if (!metaRes.ok) throw new Error('Failed to fetch file metadata');
    const metadata = await metaRes.json();

    const isGoogleWorkspace = metadata.mimeType?.startsWith('application/vnd.google-apps');

    const EXPORT_MIME_MAP: Record<string, { mime: string; ext: string }> = {
      'application/vnd.google-apps.document':     { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: 'docx' },
      'application/vnd.google-apps.spreadsheet':  { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       ext: 'xlsx' },
      'application/vnd.google-apps.presentation': { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ext: 'pptx' },
      'application/vnd.google-apps.drawing':      { mime: 'image/svg+xml', ext: 'svg' },
    };

    let downloadUrl: string;
    let finalMime: string;
    let finalName: string = metadata.name || `drive-file-${fileId}`;

    if (isGoogleWorkspace) {
      const exportTarget = EXPORT_MIME_MAP[metadata.mimeType];
      if (!exportTarget) throw new Error(`Unsupported Google Workspace type: ${metadata.mimeType}`);

      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportTarget.mime)}`;
      finalMime = exportTarget.mime;
      finalName = `${finalName}.${exportTarget.ext}`;
    } else {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      finalMime = metadata.mimeType || 'application/octet-stream';
    }

    const fileRes = await fetch(downloadUrl, { headers });
    if (!fileRes.ok) throw new Error(`Failed to download file: ${fileRes.status} ${fileRes.statusText}`);

    const blob = await fileRes.blob();
    const file = new File([blob], finalName, { type: finalMime });

    selectedFile = file;
    selectedItem = { id: 'GoogleDrive', name: file.name, img: googleDrive };
    mode = 'DeviceUpload';
  }

  function handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    selectedFile = file;

    if (file) {
      selectedItem = { id: 'DeviceUpload', name: file.name, img: fileUpload };
      mode = 'DeviceUpload';
    }
  }

  function removeSelectedFile() {
    selectedFile = null;
    selectedItem = { id: 'UploadOptions', name: 'Upload Options:', img: optionIcon };
    mode = 'UploadOptions';
    if (hiddenFileInput) hiddenFileInput.value = '';
  }

  async function uploadFile() {
    if (!selectedFile) return;
  }

  function formatBytes(bytes: number) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index++;
    }
    return `${value.toFixed(1)} ${units[index]}`;
  }
</script>

<main>
    <div class="upload-panel">
        {#if selectedFile}
            <div class="file-card">
                <div>
                    <strong>{selectedFile.name}</strong>
                    <div class="file-meta">{formatBytes(selectedFile.size)}</div>
                </div>

                <div class="file-actions">
                    <label class="conversion-label">
                        Convert to
                        <select bind:value={selectedConversion}>
                            {#each conversionTargets as target}
                                <option value={target}>{target}</option>
                            {/each}
                        </select>
                    </label>

                    <button class="remove-button" onclick={removeSelectedFile}>Remove</button>
                </div>
            </div>

            <button class="upload-button" onclick={uploadFile}>Upload</button>
        {:else}
            <div class="empty-state">
                <p>Select "Upload From Device" and choose a file to start.</p>
            </div>
        {/if}
    </div>

    <input
        type="file"
        bind:this={hiddenFileInput}
        hidden
        onchange={handleFileSelected}
    />

    <div class="dropdown-container">
        <button class="dropdown-trigger" onclick={toggleDropdown}>
            {#if selectedItem.img}
                <img src={selectedItem.img} alt={selectedItem.name} class="icon" />
            {/if}
            <span>{selectedItem.name}</span>
            <span class="arrow">{isOpen ? '^' : 'v'}</span>
        </button>

        {#if isOpen}
            <ul class="dropdown-menu">
                {#each items as item}
                    <li>
                        <button class="dropdown-item" onclick={() => selectUploadSource(item)}>
                            {#if item.img}
                                <img src={item.img} alt={item.name} class="icon" />
                            {/if}
                            <span>{item.name}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</main>

<style>
     main {
        max-width: 960px;
        margin: 40px auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 22px;
    }

    .upload-panel {
        width: 100%;
        max-width: 720px;
        padding: 22px;
        border: 1px solid #ccc;
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }

    .file-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
        gap: 16px;
    }

    .file-meta {
        margin-top: 6px;
        color: #6b7280;
        font-size: 13px;
    }

    .remove-button,
    .upload-button {
        margin-top: 16px;
        padding: 12px 18px;
        border: none;
        border-radius: 10px;
        background: #111827;
        color: white;
        cursor: pointer;
    }

    .remove-button {
        padding: 8px 12px;
        background: transparent;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    }

    .remove-button:hover {
        background: #f1f5f9;
    }

    .upload-button {
        width: 100%;
    }

    .empty-state {
        padding: 34px 0;
        text-align: center;
        color: #4b5563;
    }

    .dropdown-container {
        position: relative;
        width: 260px;
    }

     .dropdown-trigger {
        width: 100%;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
    }

    .dropdown-trigger .icon,
    .dropdown-item .icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .arrow {
        margin-left: auto;
        font-size: 14px;
        color: #667085;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        z-index: 10;
    }

    .dropdown-item {
        width: 100%;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
    }

    .dropdown-item:hover {
        background: #f1f5f9;
    }

    .file-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .conversion-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #334155;
        white-space: nowrap;
    }

    .conversion-label select {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #111827;
        cursor: pointer;
        font-size: 14px;
    }

</style>